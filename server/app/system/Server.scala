package com.coveo.blitz.server
package system

import akka.actor._
import com.coveo.blitz.server.user.User

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success, Try}

final class Server extends Actor with CustomLogging {

  import Server._

  val rounds = scala.collection.mutable.Map[GameId, ActorRef]()

  var nextArenaRoundId: Option[GameId] = None
  var nextArenaRoundClients: Int = 0

  def receive = akka.event.LoggingReceive {

    case RequestToPlayAlone(user, config) => {
      val replyTo = sender
      addRound(config, "default") match {
        case Failure(e) => replyTo ! Status.Failure(e)
        case Success((_, round)) => {
          round ! Round.Join(user, inputPromise(replyTo))
          (1 to 3) foreach { _ =>
            round ! Round.JoinBot("random", Driver.Random)
          }
        }
      }
    }

    case RequestToPlayArena(user, gameId) => {
      val replyTo = sender

      (rounds.get(gameId) match {
        case Some(round) => Success(round)
        case _ => Failure(NotFoundException(s"No round with id ${gameId}"))
      }
        ) match {
        case Failure(e) => replyTo ! Status.Failure(e)
        case Success(round) => round ! Round.Join(user, inputPromise(sender))
      }
    }

    case Start(gameId) => {
      rounds get gameId match {
        case None => {
          log.info(s"Game $gameId does not exist. Unable to join it")
          sender ! notFound(s"Unknown game $gameId")
        }
        case Some(round) => {
          round ! Round.Start()
          sender ! Status.Success("Round started!")
        }
      }
    }

    case Create(category: String) => {
      addRound(Config.arena, category) map {
        case (id, round) => {
          nextArenaRoundId = Some(id)
          nextArenaRoundClients = 1
          log.info(s"Created game $id");
          round
        }
      }
    }
    case Abort(gameId) => {
      rounds get gameId match {
        case None => {
          log.info(s"Game $gameId does not exist. Unable to abort it.")
          sender ! notFound(s"Unknown game $gameId")
        }
        case Some(round) => {
          round ! Round.Stop()
          rounds.remove(gameId)
          log.info(s"Aborted game $gameId");
        }
      }
    }

    case Play(Pov(gameId, token), dir) => rounds get gameId match {
      case None => sender ! notFound(s"Unknown game $gameId")
      case Some(round) => round.tell(Round.Play(token, dir), sender)
    }

    case Round.Inactive(id) => if (nextArenaRoundId != Some(id)) sender ! PoisonPill

    case Terminated(round) => {
      context unwatch round
      rounds filter (_._2 == round) foreach { case (id, _) => rounds -= id }
    }

    case GetEnumerator(id) => rounds get id match {
      case None => sender ! None
      case Some(round) => round ! Round.SendEnumerator(sender)
    }
  }

  def addRound(config: Config, category: String): Try[(GameId, ActorRef)] = config.make(category) map { game =>
    val round = context.actorOf(Props(new Round(game)), name = game.id)

    rounds += (game.id -> round)
    context watch round
    game.id -> round
  }
}

object Server {

  case class RequestToPlayAlone(user: User, config: Config)

  case class RequestToPlayArena(user: User, gameId: GameId)


  case class Play(pov: Pov, dir: String)

  case class Start(gameId: String)

  case class Create(category: String)

  case class Abort(gameId: String)

  case class GetEnumerator(id: String)

  import play.api.Play.current
  import play.api.libs.concurrent.Akka

  val actor = Akka.system.actorOf(Props[Server], name = "server")
}
