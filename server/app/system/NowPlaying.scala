package com.coveo.blitz.server
package system

import user.User

import akka.actor._
import play.api.libs.iteratee._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

final class NowPlaying extends Actor {

  context.system.eventStream.subscribe(self, classOf[Game])

  var games = List[Game]()

  def hasGame(id: String) = games.exists(_.id == id)

  def activeGameIds = games.filter(_.started).map(_.id)
  def allGameIds = games.map(_.id)

  val (enumerator, channel) = Concurrent.broadcast[List[String]]

  def receive = {

    case game: Game if game.arena =>
      // Update if necessary
      var newGames = games;
      if (hasGame(game.id)) {
        newGames = games filterNot (_.id == game.id)
      }
      games = game :: newGames
      channel push activeGameIds

    case game: Game if game.arena && game.finished && hasGame(game.id) =>
      games = games filterNot (_.id == game.id)
      channel push activeGameIds

    case NowPlaying.Games =>
      sender ! games.filter(!_.finished)

    case NowPlaying.GetEnumeratorForAllGames =>
      sender ! { Enumerator.enumerate(List(allGameIds)) >>> enumerator }

    case NowPlaying.GetEnumeratorForActiveGames =>
      sender ! { Enumerator.enumerate(List(activeGameIds)) >>> enumerator }

    case NowPlaying.GetEnumeratorFor(userId) => sender ! {
      Enumerator.enumerate(List(games.filter(_ hasUserId userId).map(_.id))) >>> {
        enumerator &> Enumeratee.map[List[String]] { ids =>
          ids filter { id => games.exists(g => g.id == id && (g hasUserId userId)) }
        }
      }
    }

    case NowPlaying.Init =>
  }
}

object NowPlaying {

  case object Init
  case object GetEnumeratorForActiveGames
  case object GetEnumeratorForAllGames
  case object Games
  case class GetEnumeratorFor(userId: String)

  import play.api.Play.current
  import play.api.libs.concurrent.Akka
  val actor = Akka.system.actorOf(Props[NowPlaying], name = "now-playing")
}
