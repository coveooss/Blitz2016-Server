package bot

object Main {

  val bot: Bot = new RandomBot

  def main(args: Array[String]) = makeServer match {
    case Left(error) ⇒ println(error)
    case Right(server) ⇒ args match {
      case Array() ⇒
        training(server, _.training(100))
      case Array("arena", gameId) ⇒
        arena(server, gameId)
      case Array("training", turns) ⇒
        training(server, _.training(int(turns)))
      case Array("training", turns, map) ⇒
        training(server, _.training(int(turns), Some(map)))
      case a ⇒ println("Invalid arguments: " + a.mkString(" "))
    }
  }

  def arena(server: Server, gameId: String) {
      failsafe {
        println("Waiting for pairing...")
        val input = server.arena(gameId)
        println(s"Start arena game ${input.viewUrl}")
        steps(server, input)
        println(s"Finished arena game ${input.viewUrl}")
      }
  }

  def training(server: Server, boot: Server ⇒ Input) {
    failsafe {
      val input = boot(server)
      println("Training game " + input.viewUrl)
      steps(server, input)
      println(s"\nFinished training game ${input.viewUrl}")
    }
  }

  def steps(server: Server, input: Input) {
    failsafe {
      step(server, input)
    }
  }

  def failsafe(action: ⇒ Unit) {
    try {
      action
    }
    catch {
      case e: scalaj.http.HttpException ⇒ println(s"\n[${e.code}] ${e.body}")
      case e: Exception ⇒ println(s"\n$e")
    }
  }

  @annotation.tailrec
  def step(server: Server, input: Input) {
    if (!input.game.finished) {
      print(".")
      step(server, server.move(input.playUrl, bot move input))
    }
  }

  def makeServer = (
    Option(System.getProperty("server")) getOrElse "http://blitz2016.xyz:8080",
    System.getProperty("key")
    ) match {
    case (_, null) ⇒ Left("Specify the user key with -Dkey=mySecretKey")
    case (url, key) ⇒ Right(new Server(url + "/api", key))
  }

  def int(str: String) = java.lang.Integer.parseInt(str)
}
