package com.coveo.blitz.server
package system

import controllers.Default
import play.api.mvc._
import play.api.{Application, GlobalSettings}

import scala.concurrent.Future

object Global extends WithFilters(CORSFilter()) with GlobalSettings with CustomLogging {

  override def onStart(app: Application) {
    Elo.actor ! Elo.Init
    NowPlaying.actor ! NowPlaying.Init
    //BasicConfigurator.configure();

    log.info("Starting server!");
  }

  override def onHandlerNotFound(req: RequestHeader) = {
    Future successful notFoundPage
  }
}

case class CORSFilter() extends Filter{
  import scala.concurrent._
  import ExecutionContext.Implicits.global
  lazy val allowedDomain = play.api.Play.current.configuration.getString("cors.allowed.domain")
  def isPreFlight(r: RequestHeader) =(
    r.method.toLowerCase.equals("options")
      &&
      r.headers.get("Access-Control-Request-Method").nonEmpty
    )

  def apply(f: (RequestHeader) => Future[Result])(request: RequestHeader): Future[Result] = {
    if (isPreFlight(request)) {
      Future.successful(Default.Ok.withHeaders(
        "Access-Control-Allow-Origin" -> allowedDomain.orElse(request.headers.get("Origin")).getOrElse(""),
        "Access-Control-Allow-Methods" -> request.headers.get("Access-Control-Request-Method").getOrElse("*"),
        "Access-Control-Allow-Headers" -> request.headers.get("Access-Control-Request-Headers").getOrElse(""),
        "Access-Control-Allow-Credentials" -> "true"
      ))
    } else {
      f(request).map{_.withHeaders(
        "Access-Control-Allow-Origin" -> allowedDomain.orElse(request.headers.get("Origin")).getOrElse(""),
        "Access-Control-Allow-Methods" -> request.headers.get("Access-Control-Request-Method").getOrElse("*"),
        "Access-Control-Allow-Headers" -> request.headers.get("Access-Control-Request-Headers").getOrElse(""),
        "Access-Control-Allow-Credentials" -> "true"
      )}
    }
  }
}
