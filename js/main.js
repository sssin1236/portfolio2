const btnCall = document.querySelector(".btnMo");
const menuMo = document.querySelector(".Mob");
const $article = $("article");
const $txt = $("#visual .txt");
const $top = $(".line1");
const $right = $(".line2");
const $bottom = $(".line3");
const $left = $(".line4");
const $dots = $("span");

btnCall.onclick = function(e){
    e.preventDefault();

    btnCall.classList.toggle("on");
    menuMo.classList.toggle("on");
}


//--------------------------------jQuery----------------------------------------


const $btns = $("#navi li");
const $boxs = $(".myScroll");


let posArr = [];
let enableAtv = true;
let baseLine = -250;
let speed = 700;

setPos();

$(window).on("resize", function(){
    setPos();
    let activeindex = $btns.children("a").filter(".on").parent().index();
    activeScroll(activeindex);
});

$(window).on("scroll", function(){
    let scroll = $(window).scrollTop();
    activation(scroll);
});

$boxs.on("mousewheel",function(e){
    e.preventDefault();

    if(enableAtv){
        enableAtv = false;

        let i = $(e.currentTarget).index();

        if(e.originalEvent.deltaY > 0){
            activeScroll(i+1);
        }else{
            activeScroll(i-1);
        }
    }
});


$btns.on("click", function(e){
    e.preventDefault();
    let isOn = $(e.currentTarget).children("a").hasClass("on");
    if(isOn) return;

    if(enableAtv){
        enableAtv = false;

        let target = $(e.currentTarget).index();
        activeScroll(target);
    }
});

function setPos(){
    posArr = [];
    $boxs.each(function(index){
        posArr.push($boxs.eq(index).offset().top);
    });
}

function activation(scroll){
    $boxs.each(function(index){
        if(scroll >+ posArr[index] + baseLine){
            $btns.children("a").removeClass("on");
            $btns.eq(index).children("a").addClass("on");

            $boxs.removeClass("on");
            $boxs.eq(index).addClass("on");
        }
    });
}

function activeScroll(index){
    $("html, body").stop().animate({ scrollTop : posArr[index] }, 1000, function(){
        enableAtv = true;
    });
}

//gnb menu -----------------------------------------------------------------------
$("#gnb>li").on("mouseenter", function(){
    $(this).find(".subMenu").show();
});

$("#gnb>li").on("mouseleave",function(){
    $(this).find(".subMenu").hide();
});

$("#gnb>li").each(function(index){
    $("#gnb>li").eq(index).find("a").on("focusin",function(){
        $("#gnb>li").eq(index).find(".subMenu").show();            
    });

     $("#gnb>li").eq(index).find("a").last().on("focusout", function(){
        $("#gnb>li").eq(index).find(".subMenu").hide();
     })  ; 
})

$("dt").on("click", function(){

    let isOn = $(this).hasClass("on");
    
    $("dt").removeClass("on");
    $("dt").next().slideUp(500);

    if(isOn){
        $(this).removeClass("on");
        $(this).next().slideUp(500);
    }else{
        $(this).addClass("on");
        $(this).next().slideDown(500);
    }
});


// 쿠키 팝업-------------------------------------------------------------------
let isCookie = document.cookie.indexOf("popup=done");
console.log(isCookie);

if(isCookie == -1){
    $("#popup").show();
}else{
    $("#popup").hide();
}

$("#popup .content .close").on("click", function(e){
    e.preventDefault();

    let isChecked = $("#popup").find("input[type=checkbox]").is(":checked");

    if(isChecked) setCookie(1);

    $("#popup").slideUp(500);
});

function setCookie(time){
    let today = new Date();
    let date = today.getDate();

    today.setDate(date + time);

    let duedate = today.toGMTString();

    document.cookie = "popup=done; expires"+duedate;
}

// 롤링 배너 -------------------------------------------------------------------
/*
const $rollWrap = $(".rolling").parent();
let timer;
let num = 0;

timer = setInterval(roll, 20);

$(".rolling").parent().on("mouseenter", function(){
    clearInterval(timer);
});
$(".rolling").parent().on("mouseleave", function(){
    timer = setInterval(roll, 20);
});

function roll(){
    if(num <= -250){
        num = 0;
        $(".rolling").find("article").first().appendTo($(".rolling"));
    }else{
        num -= 2;
    }
    $(".rolling").css({marginLeft: num});
}
*/

// 스와이퍼 -----------------------------------------------------------------------


const swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    speed : 500,
    spaceBetween : 0,
    slidesPerView: "auto",
    autoplay:{
        delay: 1300,
        disableOnInteraction : true 
    },
    coverflowEffect: {
        rotate: 50,
        stretch: -100,
        depth: 400,
        modifier: 1,
        slideShadows: true,
    },
    
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

const btnStart = document.querySelector(".btnStart");
const btnStop = document.querySelector(".btnStop");

swiper.autoplay.stop();

btnStart.onclick = function(){
    swiper.autoplay.start();
}

btnStop.onclick = function(){
    swiper.autoplay.stop();
}


