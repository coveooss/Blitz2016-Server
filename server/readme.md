On your machine:
install typesafe activator
run activator
in activator, run `dist`
This will generate a universal distributable version of vindinium

Copy it on a EC2 machine

On the machine:
Install mongoDB on that machine (https://docs.mongodb.org/v3.0/tutorial/install-mongodb-on-amazon/)
Start mongodb server

Uninstall Java 1.7
`sudo yum remove java-1.7.0-openjdk`
Install Java 1.8
`sudo yum install java-1.8.0` 

bash ./vindinium -Dhttp.port=80

