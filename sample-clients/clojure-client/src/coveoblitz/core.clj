(ns coveoblitz.core
  (:gen-class)
  (:use [slingshot.slingshot :only [try+, throw+]])
  (:use [clojure.core.match :only (match)]))

(require '[clj-http.client :as http])

(def server-url "http://blitz2016.xyz:8080")

(defn bot [input]
  (first (shuffle ["north", "south", "east", "west", "stay"])))

(defn at [[x y] tiles size]
 (tiles (+ (* y size) x)))

(defn improve-input [input]
  (-> input
      (update-in [:game :board :tiles] vec)))

(defn parse-tile [tile]
  (match (vec tile)
         [\space \space] {:tile :air}
         [\# \#] {:tile :wall}
         [\[ \]] {:tile :tavern}
         [\$ \-] {:tile :mine}
         [\^ \^] {:tile :spike}
         [\$ i] {:tile :mine :of i}
         [\@ i] {:tile :hero :id (Integer/parseInt (str i))}))

(defn parse-tiles [tiles] (map parse-tile (partition 2 (seq tiles))))

(defn parse-input [input] (update-in input [:game :board :tiles] parse-tiles))

(defn request [url, params]
  "makes a POST request and returns a parsed input"
  (try+
    (-> (http/post url {:form-params params :as :json})
        :body
        parse-input
        improve-input)
    (catch map? {:keys [status body]}
      (println (str "[" status "] " body))
      (throw+))))


(defn step [from]
  (loop [input from]
    (print ".")
    (let [next (request (:playUrl input) {:dir (bot input)})]
      (if (:finished (:game next)) (println "") (recur next)))))

(defn training [secret-key]
  (let [input (request (str server-url "/api/training") {:key secret-key})]
    (println (str "Starting training game " (:viewUrl input)))
    (step input)
    (println (str "Finished training game " (:viewUrl input)))))

(defn arena [secret-key game-id]
    (let [input (request (str server-url "/api/arena?gameId=" game-id) {:key secret-key})]
      (println (str "Starting competition game " (:viewUrl input)))
      (step input)
      (println (str "Finished competition game " (:viewUrl input)))))

(def usage
  "Usage:
   training <secret-key>
   competition <secret-key> <game-id>")

(defn -main [& args]
  (match (vec args)
         ["training", secret-key, nb] (training secret-key)
         ["competition", secret-key, game-id] (arena secret-key game-id)
         :else (println usage)))
