package com.coveo.blitz.server
package system

import akka.actor._
import com.coveo.blitz.server.user.User
import play.api.libs.iteratee._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Promise
import scala.concurrent.duration._
import scala.util.{Failure, Success}

final class Round(val initGame: Game) extends Actor with CustomLogging {

  val clients = collection.mutable.Map[Token, ActorRef]()
  val moves = collection.mutable.ArrayBuffer[Dir]()
  var gameAtStart = initGame
  var game = initGame

  val (enumerator, channel) = Concurrent.broadcast[Game]

  import Round._

  context setReceiveTimeout 1.minute

  context.system.eventStream.publish(game)

  def receive = {

    case SendEnumerator(to) => to ! Some {
      (enumerator interleave {
        (Enumerator enumerate moves) &> Enumeratee.scanLeft(gameAtStart)(Arbiter.replay)
      }) &> StreamUnfucker()
    }

    case msg@Play(token, _) => clients get token match {
      case None =>
        log.warning(s"No client for ${game.id}/$token")
        sender ! notFound("Wrong or expired token")
      case Some(client) => client ! ClientPlay(msg, sender)
    }

    case ClientPlay(Play(token, d), replyTo) => {
      val client = sender
      val dir = Dir(d)
      Arbiter.move(game, token, dir) match {
        case Failure(e) =>
          log.info(s"Play fail ${game.id}/$token: ${e.getMessage}")
          replyTo ! Status.Failure(e)
        case Success(g) =>
          client ! Client.WorkDone(inputPromise(replyTo))
          saveMove(dir)
          step(g)
      }
    }

    case Join(user, promise) => {
      val heroId = game.heroes.find(hero => hero.userId == Some(user.id)) match {
        // This team already registered before. Simply update the hero.
        case Some(hero) => hero.id
        // New team
        case _ => clients.size + 1
      }
      game = game.withHero(heroId, user.blame)
      // FIXME
      val token = game.hero(heroId).token
      log.info(s"[game ${game.id}] add user ${user.name} #$heroId ($token)")
      if (!clients.contains(token)) {
        log.info(s"Registering new client associated with token $token")
        addClient(token, Props(new HttpClient(token, promise)))
      }
    }

    case JoinBot(name, driver) => {
      val heroId = clients.size + 1
      game = game.withHero(heroId, _ withName name)
      // FIXME
      val token = game.hero(heroId).token
      log.info(s"[game ${game.id}] add bot $name ($token)")
      addClient(token, Props(new BotClient(token, driver)))
    }

    case Start() => {
      // TODO: Fill missing slots with bots?
      startGame()
    }

    case Stop() => {
      // TODO: Kill clients? Other cleanup?
      game = game.copy(status = com.coveo.blitz.server.Status.Aborted)
      context.system.eventStream.publish(game)
    }

    case Client.Timeout(token) => {
      log.info(s"${game.id}/$token timeout")
      val dir = Dir.Crash
      Arbiter.move(game, token, dir) match {
        case Failure(e) => log.warning(s"Crash fail ${game.id}/$token: ${e.getMessage}")
        case Success(g) =>
          saveMove(dir)
          step(g)
      }
    }

    case Terminated(client) => {
      context unwatch client
      clients filter (_._2 == client) foreach { case (id, _) => clients -= id }
    }

    case ReceiveTimeout => context.parent ! Inactive(game.id)
  }

  def addClient(token: Token, props: Props) {
    val client = context.actorOf(props, name = token)
    clients += (token -> client)
    game = game.withHero(game.hero(clients.size).setReady)
    context watch client
    if (clients.size == 4 && (game.training || game.autostart)) {
      startGame()
    }
    context.system.eventStream.publish(game)
  }

  def startGame(): Unit = {
    if (!game.started) {
      if (game.heroes.size != clients.size) {
        log.info(s"Unable to start game ${game.id} as it only has ${clients.size} clients")
      } else {
        log.info(s"[game ${game.id}] start")
        game = game.start
        gameAtStart = game
        game.hero map (_.token) flatMap clients.get match {
          case None => throw UtterFailException(s"Game ${game.id} started without a hero client")
          case Some(client) =>
            Replay insert game
            client ! game
        }
      }
    }
  }

  def stayCrashed(token: String) = Arbiter.move(game, token, Dir.Stay) match {
    case Failure(e) => log.info(s"Crashed stay fail ${
      game.id
    }/$token: ${
      e.getMessage
    }")
    case Success(g) =>
      saveMove(Dir.Stay)
      step(g)
  }

  def saveMove(dir: Dir) {
    moves += dir
    Replay.addMove(game.id, dir)
  }

  def step(g: Game) {
    game = g
    channel push game
    context.system.eventStream publish game

    if (game.finished) {
      Replay.finish(game.id, moves, game)
      clients.values foreach (_ ! game)
      channel.eofAndEnd
    }
    else game.hero foreach {
      case h if h.crashed => stayCrashed(h.token)
      case h => clients get h.token foreach (_ ! game)
    }
  }
}

object Round {

  case class Play(token: Token, dir: String)

  case class ClientPlay(play: Play, replyTo: ActorRef)

  case class Join(user: User, promise: Promise[PlayerInput])

  case class JoinBot(name: String, driver: Driver)

  case class Start();

  case class Stop();

  case class Inactive(id: GameId)

  case class SendEnumerator(to: ActorRef)

}
