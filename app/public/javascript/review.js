$(document).on('click', '#submit', function(){
    const tutor_id =  $(this).parents(".sub_review").find("#tutor_id").text().split(" ");
    var review_text = $(this).parents(".sub_review").find("#review_text").val();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    var formatedDate = today.toLocaleDateString("en-US", options);
    var scores = $('#score_option').val();

    var check_login = $(this).parents(".sub_review").find("#check_login").text();
    
    if(check_login == "true"){
        if (scores == "None"){
            alert("select scores")
        }else{
            $.post("/submit_review", {
                tutor_id: tutor_id[0],
                review: review_text,
                date: formatedDate,
                scores: scores
            });
            location.reload()
        }
    } else{
        alert("Log in to write review")
        window.location = "/signin"
    }
})
