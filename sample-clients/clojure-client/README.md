Clojure starter pack for CoveoBlitz 2016

## Usage
If you don't have lein, install it! 
See instruction here : http://leiningen.org/

Then run : 

```
$ lein repl
```

```clojure
> ; (re)load the code
> (require 'coveoblitz.core :reload)

> ; run a training game
> (coveoblitz.core/-main "training" "secretkey" "x")

> ; run a competition game
> (coveoblitz.core/-main "competition" "secretkey" "myGameId")
```

Yes we're lazy and terrible with Clojure so you must provide a gameId even when using training. It will be ignored. Deal with it.
