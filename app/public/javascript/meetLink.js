$(document).on('click', '#name', function(){

    const tutor_id =  $(this).parents(".tutor").find("#tutor_id").text().split(" ");

    $.post("/meet_result", {
        A_id: tutor_id[0]
    }, window.location = "tutorProf").done();
})

$(document).on('click', '#review', function(){

    const tutor_id =  $(this).parents(".tutor").find("#tutor_id").text().split(" ");

    $.post("/review", {
        A_id: tutor_id[0]
    }, window.location = "review").done();

    // $.get("/review", window.location = "review")
})
