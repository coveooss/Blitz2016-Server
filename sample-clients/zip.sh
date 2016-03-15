#!/bin/bash
for i in */; do zip -o -r "${i%/}.zip" "$i"; done

