package controllers

import akka.pattern.ask
import akka.util.Timeout
import com.coveo.blitz.server._
import com.coveo.blitz.server.system._
import com.coveo.blitz.server.user.{User => U}
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

object Api extends Controller {

  def training = Action.async { implicit req =>
    implicit val timeout = Timeout(10.minutes)
    form.training.bindFromRequest.fold(
      err => Future successful BadRequest(
        "Did you forget the key parameter?"
      ),
      data => U findByKey data.key flatMap {
        case None => Future failed UserNotFoundException("Key not found")
        case Some(user) => (Server.actor ? Server.RequestToPlayAlone(user, data.config)) map {
          case input: PlayerInput => {
            Ok(JsonFormat(input, req.host)) as JSON
          }
        }
      } recover {
        case e: GameException => {
          play.api.Logger("API").warn(e.toString)
          BadRequest(e.getMessage)
        }
      }
    )
  }

  def arena(gameId: GameId) = Action.async { implicit req =>
    implicit val timeout = Timeout(24.hours)
    form.arena.bindFromRequest.fold(
      err => Future successful BadRequest(
        "Did you forget the key parameter?"
      ),
      key => U findByKey key flatMap {
        case None => Future failed UserNotFoundException("Key not found")
        case Some(user) => (Server.actor ? Server.RequestToPlayArena(user, gameId)) map {
          case input: PlayerInput => {
            Ok(JsonFormat(input, req.host)) as JSON
          }
        }
      } recover {
        case e: GameException => {
          play.api.Logger("API").warn(e.toString)
          BadRequest(e.getMessage)
        }
      }
    )
  }

  def move(gameId: String, token: String) = Action.async { implicit req =>
    implicit val timeout = Timeout(10.seconds)
    form.move.bindFromRequest.fold(
      err => Future successful BadRequest,
      dir => Server.actor ? Server.Play(Pov(gameId, token), dir) map {
        case input: PlayerInput => {
          Ok(JsonFormat(input, req.host)) as JSON
        }
      } recover {
        case e: NotFoundException      => NotFound(e.getMessage)
        case e: RuleViolationException => BadRequest(e.getMessage)
        case e: TimeoutException       => BadRequest(e.getMessage)
      }
    )
  }
}
