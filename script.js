$(document).ready(function() {
    let allSymbols = ["🍎", "🍌", "🍒", "🍇", "🍓", "🍍", "🥝", "🍉", "🍊", "🍋", "🥭", "🍑"];
    let symbols = [];
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;
    let timer = 0;
    let timerInterval;
    let timerStarted = false;
    let difficulty = "easy";
    let boardWidth = 4;

    const difficultySettings = {
        easy: { pairs: 4, width: 4 },     
        medium: { pairs: 8, width: 4 },   
        hard: { pairs: 12, width: 6 }     
    };

    function initGame() {
        const settings = difficultySettings[difficulty];
        symbols = allSymbols.slice(0, settings.pairs);
        boardWidth = settings.width;

        cards = [...symbols, ...symbols];
        cards = shuffleArray(cards);
        
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        moves = 0;
        matches = 0;
        timer = 0;
        timerStarted = false;
        
        $("#moves").text(moves);
        $("#timer").text(timer);
        $("#winMessage").hide();
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        $("#gameBoard").empty();

        const cardWidth = 80;
        const cardMargin = 5;
        const totalWidth = (cardWidth + cardMargin * 2) * boardWidth;
        $("#gameBoard").css("width", totalWidth + "px");
        
        cards.forEach((symbol, index) => {
            let card = $("<div class='card'></div>");
            card.attr("data-symbol", symbol);
            card.attr("data-index", index);
            card.text("");
            $("#gameBoard").append(card);
        });
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function startTimer() {
        timerInterval = setInterval(function() {
            timer++;
            $("#timer").text(timer);
        }, 1000);
    }

    function checkMatch() {
        if (firstCard.data("symbol") === secondCard.data("symbol")) {
            playSound("match");
            
            firstCard.addClass("matched");
            secondCard.addClass("matched");
            
            firstCard = null;
            secondCard = null;
            lockBoard = false;
            
            matches++;
            
            if (matches === symbols.length) {
                clearInterval(timerInterval);
                $("#winMessage").fadeIn();
            }
        } else {
            playSound("wrong");
            
            setTimeout(function() {
                firstCard.removeClass("flipped").text("");
                secondCard.removeClass("flipped").text("");
                
                firstCard = null;
                secondCard = null;
                lockBoard = false;
            }, 1000);
        }
    }

    function playSound(type) {
        let sound = type === "match" ? $("#matchSound")[0] : $("#wrongSound")[0];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound play failed:", e));
        }
    }

    initGame();

    $("#gameBoard").on("click", ".card", function() {
        if (lockBoard || $(this).hasClass("flipped") || $(this).hasClass("matched")) {
            return;
        }
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }

        $(this).addClass("flipped");
        $(this).text($(this).data("symbol"));

        if (!firstCard) {
            firstCard = $(this);
            return;
        }

        secondCard = $(this);
        lockBoard = true;
        
        moves++;
        $("#moves").text(moves);

        checkMatch();
    });

    $(".difficulty-btn").click(function() {
        $(".difficulty-btn").removeClass("active");
        $(this).addClass("active");
        difficulty = $(this).data("level");
        initGame();
    });
});