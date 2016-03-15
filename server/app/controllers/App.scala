package controllers

import com.coveo.blitz.server._
import play.api.http.HeaderNames
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

object App extends Controller {

  def index = Action.async {
    val topUserNb = 50
    val recentReplayNb = 50
    system.Replay recent recentReplayNb zip user.User.top(topUserNb) map {
      case (replays, users) => Ok(views.html.index(replays, users))
    }
  }

  def options(path: String) = CorsAction {
    Action { request =>
      Ok.withHeaders(ACCESS_CONTROL_ALLOW_HEADERS -> Seq(AUTHORIZATION, CONTENT_TYPE, "Target-URL").mkString(","))
    }
  }
}

// Adds the CORS header
case class CorsAction[A](action: Action[A]) extends Action[A] {

  def apply(request: Request[A]): Future[Result] = {
    action(request).map(result => result.withHeaders(HeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN -> "*",
      HeaderNames.ALLOW -> "*",
      HeaderNames.ACCESS_CONTROL_ALLOW_METHODS -> "POST, GET, PUT, DELETE, OPTIONS",
      HeaderNames.ACCESS_CONTROL_ALLOW_HEADERS -> "Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent"
    ))
  }

  lazy val parser = action.parser
}
