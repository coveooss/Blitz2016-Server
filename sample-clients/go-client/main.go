package main

import (
	"flag"
	"fmt"
	"os"

	"./blitz"
)

var (
	client blitz.Client
	count  string
	games  int
)

func init() {
	flag.StringVar(&client.Server, "s", "http://blitz2016.xyz:8080", "server")
	flag.StringVar(&client.Key, "k", "", "api key")
	flag.StringVar(&client.Mode, "m", "arena", "mode (arena or training)")
	flag.StringVar(&client.GameId, "g", "", "game id (for arena)")
	flag.StringVar(&count, "c", "30", "number of turns to play")
	flag.BoolVar(&client.RandomMap, "r", true, "use random map (useful for training against same map)")
	flag.BoolVar(&client.Debug, "d", false, "debug output")
	flag.Usage = func() {
		fmt.Printf("Usage %s [FLAGS]\n", os.Args[0])
		flag.PrintDefaults()
	}
	flag.Parse()
}

func main() {
	if client.Key == "" {
		fmt.Println("API key required. Pass using the -k flag. Use -h to view help.")
		os.Exit(1)
	}

	if client.Mode == "training" {
		games = 1
		client.Turns = count
	} else {
		if client.GameId == "" {
			fmt.Println("Game ID required for arena. Pass using the -g flag or use -m training. Use -h to view help.")
			os.Exit(1)
		}
		games = 1
		client.Turns = "300"
	}

	client.Setup()
	for i := 0; i < games; i++ {
		if err := client.Start(); err != nil {
			panic(err.Error())
		}
		if err := client.Play(); err != nil {
			panic(err.Error())
		}
	}
}
