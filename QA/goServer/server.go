package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "password"
	dbname   = "sdc"
)

func bigGetRequest() {
	rows, err:= db.Query("SELECT questions.id AS question_id, questions.product_id, questions.body AS question_body, questions.date_written AS question_date, questions.helpful AS question_helpfulness, questions.asker_name, answers.id AS answer_id, answers.question_id, answers.body, answers.answerer_name, answers.answerer_email, answers.helpful as helpfulness, answers.reported AS answer_reported, answers.date_written AS date, photos.id AS photo_id, photos.answer_id AS photos_answer_id, photos.url FROM questions JOIN answers ON answers.question_id=questions.id JOIN photos ON photos.answer_id=answers.id where questions.product_id=$1 and questions.reported=0 LIMIT $2 OFFSET $3"),
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/hello" {
			http.Error(w, "404 not found.", http.StatusNotFound)
			return
	}

	if r.Method != "GET" {
			http.Error(w, "Method is not supported.", http.StatusNotFound)
			return
	}


	fmt.Fprintf(w, "Hello!")
}


func main() {
	http.HandleFunc("/hello", helloHandler) // Update this line of code
	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

        // open database
    db, err := sql.Open("postgres", psqlconn)
    CheckError(err)

        // close database
    defer db.Close()

        // check db
    err = db.Ping()
    CheckError(err)

    fmt.Println("Connected!")

	fmt.Printf("Starting server at port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
			log.Fatal(err)
	}
}

func CheckError(err error) {
	if err != nil {
			panic(err)
	}
}