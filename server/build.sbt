lazy val vindinium = (project in file(".")).enablePlugins(PlayScala)

name := "vindinium"

version := "1.1"

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "reactivemongo" % "0.10.5.0.akka23",
  "org.reactivemongo" %% "play2-reactivemongo" % "0.10.5.0.akka23",
  "joda-time" % "joda-time" % "2.3",
  "com.logentries" % "logentries-appender" % "1.1.32",
  "log4j" % "log4j" % "1.2.17")

libraryDependencies += filters

resolvers ++= Seq(
  "sonatype snapshots" at "https://oss.sonatype.org/content/repositories/snapshots")

scalacOptions ++= Seq("-feature", "-language:_", "-unchecked", "-deprecation")

TwirlKeys.templateImports in Compile ++= Seq(
  "com.coveo.blitz.server.{ Game, Board, Hero, JsonFormat }",
  "com.coveo.blitz.server.system.Replay",
  "com.coveo.blitz.server.user.User")

sources in doc in Compile := List()


