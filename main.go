package main

import (
	"fmt"
	"log"

	"github.com/elastic/go-sysinfo"
)

func main() {
	hostinfo, err := sysinfo.Host()
	if err != nil {
		log.Fatalln(err)
	} else {
		fmt.Println(hostinfo.Info().MACs)
	}
}