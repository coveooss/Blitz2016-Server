package com.coveo.blitz.server
package system

trait CustomLogging {

  object log {

    val log2 = org.apache.log4j.LogManager.getRootLogger()

    def info(msg: String) = log2.info(msg)

    def warning(msg: String) = log2.warn(msg)

    def error(msg: String) = log2.error(msg)

  }

}
