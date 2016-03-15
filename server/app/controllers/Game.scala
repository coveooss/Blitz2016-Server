package controllers

import akka.pattern.ask
import com.coveo.blitz.server._
import com.coveo.blitz.server.system.{Replay, Server}
import com.coveo.blitz.server.user.{User => U}
import play.api.Play.current
import play.api.libs.Comet.CometMessage
import play.api.libs.EventSource
import play.api.libs.iteratee._
import play.api.libs.json._
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

object Game extends Controller {

  val API_KEY = play.api.Play.configuration.getString("vindinium.api-key").getOrElse("")

  def nowPlaying = Action.async {
    system.NowPlaying.actor ? system.NowPlaying.GetEnumeratorForActiveGames mapTo
      manifest[Enumerator[List[String]]] map { enumerator =>
      val toJsonArray = Enumeratee.map[List[String]] { ids =>
        Json stringify JsArray(ids map JsString.apply)
      }
      Ok.chunked(enumerator &> toJsonArray &> EventSource()).as("text/event-stream")
    }
  }

  def nowAvailable = Action.async {
    system.NowPlaying.actor ? system.NowPlaying.GetEnumeratorForAllGames mapTo
      manifest[Enumerator[List[String]]] map { enumerator =>
      val toJsonArray = Enumeratee.map[List[String]] { ids =>
        Json stringify JsArray(ids map JsString.apply)
      }
      Ok.chunked(enumerator &> toJsonArray &> EventSource()).as("text/event-stream")
    }
  }

  def listActiveGames(apiKey: Option[String]) = Action.async {
    apiKey match {
      case Some(API_KEY) => {
        val activeGames = system.NowPlaying.actor ? system.NowPlaying.Games
        activeGames.mapTo(manifest[List[Game]]).map(games => Ok(Json.toJson(games.map(JsonFormat(_)))));

      } case _ => Future.successful(unauthorized)
    }
  }

  def tv = Action.async {
    Replay recent 3 map { replays =>
      replays find (!_.finished) orElse replays.headOption match {
        case None => Redirect(routes.App.index)
        case Some(replay) => Ok(views.html.visualize(replay))
      }
    }
  }

  def map(delay: Int) = Action {
    system.RandomMap() match {
      case Some(replay) => Ok(views.html.visualize(replay, Some(delay)))
      case _ => Redirect(routes.Game.map(delay))
    }
  }

  def show(id: String) = Action.async {
    Replay find id map {
      case Some(replay) => Ok(views.html.visualize(replay))
      case None => notFoundPage
    }
  }

  def getAllStartedGames(apiKey: Option[String]) = Action.async {
    apiKey match {
      case Some(API_KEY) => {
        Replay.listArenaGames() map {
          replays => Ok(Json.toJson(replays.map(_.finalGameState).flatten.map(JsonFormat(_))));
        }
      } case _ => Future.successful(unauthorized)
    }
  }

  def getAllTrainingGames(apiKey: Option[String]) = Action.async {
    apiKey match {
      case Some(API_KEY) => {
        Replay.listTrainingGames() map {
          replays => Ok(Json.toJson(replays.map(_.finalGameState).flatten.map(JsonFormat(_))));
        }
      } case _ => Future.successful(unauthorized)
    }
  }

  def start(id: String, apiKey: Option[String]) = Action {
    apiKey match {
      case Some(API_KEY) => {
        Server.actor ! Server.Start(id)
        Ok("Started.. maybe")
      }
      case _ => unauthorized
    }
  }

  def create(category: String, apiKey: Option[String]) = Action {
    apiKey match {
      case Some(API_KEY) => {
        Server.actor ! Server.Create(category)
        Ok("Created")
      }
      case _ => unauthorized
    }
  }

  def abort(id: String, apiKey: Option[String]) = Action {
    // Aborts a game that hasn't been started yet
    apiKey match {
      case Some(API_KEY) => {
        Server.actor ! Server.Abort(id)
        Ok("Deleting...")
      }
      case _ => unauthorized
    }
  }

  private implicit val timeout = akka.util.Timeout(1.second)
  private implicit val encoder = CometMessage[String](identity)

  private val asJsonString: Enumeratee[Game, String] =
    Enumeratee.map[Game](game => Json stringify JsonFormat(game))

  private def eventSource(data: Enumerator[Game]) =
    Ok.chunked(data &> asJsonString &> EventSource()).as("text/event-stream")

  def events(id: String) = Action.async {
    system.RandomMap get id match {
      case Some(replay) => Future successful eventSource(replay.games)
      case None => Server.actor ? Server.GetEnumerator(id) mapTo manifest[Option[Enumerator[Game]]] flatMap {
        case Some(enumerator) => Future successful eventSource(enumerator)
        case None => Replay find id map {
          case None => notFoundPage
          case Some(replay) => eventSource(replay.games)
        }
      }
    }
  }
}
