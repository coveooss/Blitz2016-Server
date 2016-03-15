package com.coveo.blitz.server
package system

import MongoDB._
import org.joda.time.DateTime
import play.api.libs.iteratee._
import play.api.libs.json._
import play.api.Play.current
import reactivemongo.bson._
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class Replay(
                   _id: String,
                   initGameState: Game,
                   moves: List[Dir],
                   training: Boolean,
                   names: List[String],
                   finished: Boolean,
                   date: DateTime,
                   finalGameState: Option[Game]) {

  def games: Enumerator[Game] =
    (Enumerator enumerate moves) &> Enumeratee.scanLeft(initGameState)(Arbiter.replay)

  def id = _id
}

object Replay {

  import BSONHandlers._

  def make(game: Game) = Replay(
    _id = game.id,
    initGameState = game,
    moves = Nil,
    training = game.training,
    names = game.names,
    finished = game.finished,
    date = DateTime.now,
    finalGameState = None)

  def find(id: String): Future[Option[Replay]] =
    coll.find(BSONDocument("_id" -> id)).one[Replay]

  def recent(nb: Int): Future[List[Replay]] =
    coll.find(BSONDocument("training" -> false))
      .sort(BSONDocument("date" -> -1))
      .cursor[Replay].collect[List](nb)

  def listArenaGames(): Future[List[Replay]] =
    coll.find(BSONDocument("training" -> false)).sort(BSONDocument("date" -> -1)).cursor[Replay].collect[List]()

  def listTrainingGames(): Future[List[Replay]] =
    coll.find(BSONDocument("training" -> true)).sort(BSONDocument("date" -> -1)).cursor[Replay].collect[List]()

  def recentByUserName(name: String, nb: Int): Future[List[Replay]] =
    coll.find(BSONDocument("training" -> false, "names" -> name))
      .sort(BSONDocument("date" -> -1))
      .cursor[Replay].collect[List](nb)

  def addMove(id: String, dir: Dir) = coll.update(
    BSONDocument("_id" -> id),
    BSONDocument("$push" -> BSONDocument("moves" -> dir))
  )

  def finish(id: String, moves: Seq[Dir], finalGameState: Game) = coll.update(
    BSONDocument("_id" -> id),
    BSONDocument("$set" -> BSONDocument(
      "finished" -> true,
      "moves" -> moves,
      "finalGameState" -> finalGameState
    ))
  )

  def insert(game: Game) = coll.insert(make(game))

  private val db = play.modules.reactivemongo.ReactiveMongoPlugin.db
  private val coll = db("replay")
}
