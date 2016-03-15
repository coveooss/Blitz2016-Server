package blitz

import "math/rand"

type Direction string

var DIRS = []Direction{"Stay", "North", "South", "East", "West"}

func randDir() Direction {
	dir := DIRS[rand.Intn(len(DIRS))]

	return dir
}

type Bot interface {
	Move(state *State) Direction
}

type RandomBot struct{}

func (b *RandomBot) Move(state *State) Direction {
	return randDir()
}
