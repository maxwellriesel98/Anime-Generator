import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//generate an api request based on user input data
function parseRequest(genre,ageRating,animeType,score){

    var requestUrl = "https://api.jikan.moe/v4/anime?status=complete"

    if(genre !== ""){
        requestUrl+="&genres="+genre;
    }
    if(ageRating !== ""){
        requestUrl+="&rating="+ageRating;
    }
    if(score !== ""){
        requestUrl+="&min_score="+score;
    }
    if(genre !== ""){
        requestUrl+="&type="+animeType;
    }

    return requestUrl;
}


app.get("/", (req,res) =>{

    res.sendFile(__dirname + "/public/index.html");

});

app.post("/submit" , async (req, res) => {
    try {
        
        var animeListUrl = parseRequest(req.body["genre"],req.body["ageRating"],req.body["animeType"],req.body["score"]);
        console.log(animeListUrl);
        //query api for list of all the anime that fit the request.
        //get the page list, pick a random page, and a random 
        //anime from that random page
        const Response = await axios.get(
            animeListUrl
          );
          const result = Response.data;
          //picks a random page
          var randPage = "&page=" + (Math.floor(Math.random() *
          result.pagination.last_visible_page) +1);

          const finalResponse = await axios.get(
            animeListUrl+randPage
          );
          //get a random page too
          const paginatedResult = finalResponse.data;

          var chosenAnime = paginatedResult.data[Math.floor(Math.random()*paginatedResult.data.length)];

          console.log(chosenAnime);

          res.render("index.ejs", { chosenAnime });

    } 
    
    catch (error) {

        console.error("Failed to make request:", error.message);
        res.render("solution.ejs", {
      error: "No activities that match your criteria.",
        });
        
    }

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });