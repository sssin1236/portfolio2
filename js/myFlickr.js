const btnCall = document.querySelector(".btnMo");
const menuMo = document.querySelector(".Mob");

btnCall.onclick = function(e){
    e.preventDefault();

    btnCall.classList.toggle("on");
    menuMo.classList.toggle("on");
}

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

//flickr 함수 --------------------------------------------------------------------------
function MyFlickr(){
    this.init();
    this.bindingEvent();
}

MyFlickr.prototype.init = function(){
    this.search = $(".search");
    this.btnSearch = search.find("a");
    this.input = search.find("input");
    this.logo = $(".inner h1");
    this.gallery = $("#gallery");
}

MyFlickr.prototype.bindingEvent = function(){
    this.getList({
        type: "userid",
        user_id: "194134849@N06"
    });
    
    this.btnSearch.on("click", function(e){
        e.preventDefault();
    
        var search = this.input.val();
        
        if(!search){
            this.input.attr("placeholder", "검색어를 입력하세요.");
            this.input.focus();
            this.input.on("focusout", function(){
                this.input.attr("placeholder", "SEARCH")
            });
            return;
        }
        
        this.gallery.children("ul").removeClass("on");
        $(".loadImg").removeClass("off");
        this.input.val("");
    
        this.getList({
            type: "search",
            tag: search
        }); 
    }.bind(this));
    
    $(window).on("keypress", function(e){
        if(e.keyCode == 13){
            var search = this.input.val();
        
            if(!search){
                this.input.attr("placeholder", "검색어를 입력하세요.");
                this.input.focus();
                this.input.on("focusout", function(){
                    this.input.attr("placeholder", "SEARCH")
                });
                return;
            }
            
            this.gallery.children("ul").removeClass("on");
            $(".loadImg").removeClass("off");
            this.input.val("");
    
            this.getList({
                type: "search",
                tag: search
            }); 
        }
    }.bind(this));
    
    
    this.logo.on("click", function(){
        this.gallery.children("ul").removeClass("on");
        $(".loadImg").removeClass("off");
    
        this.getList({
            type: "userid",
            user_id: "194134849@N06"
        });
    }.bind(this));
    
    $("body").on("click", this.gallery.selector+" ul li", function(e){
        e.preventDefault();
    
        let imgSrc = $(e.currentTarget).children("a").attr("href");
    
        $("body").append(
            $("<div class='pop'>")
                .append(
                    $("<img>").attr({ src : imgSrc }),
                    $("<span>").append("<b>CLOSE</b>")
                )
        )
    });
    
    $("body").on("click", ".pop span", function(){
        $(".pop").fadeOut();
    });
}



MyFlick.prototype.getList = function(flickr){
    let result_flickr = {};

    if(flickr.type =="interest"){
        result_flickr = {
            url:"https://www.flickr.com/services/rest/?method=flickr.interestingness.getList",
            dataType:"json",
            data:{
                api_key:"645bbdf320519f9a5473a288fc9f617a",
                per_page:12,
                format:"json",
                nojsoncallback:1,
                privacy_filter: 1,
            }
        }
    }

    if(flickr.type == "search"){
        result_flickr = {
            url: "https://www.flickr.com/services/rest/?method=flickr.photos.search",
            dataType:"json", 
            data:{
                api_key:"d61e30a1010fe3e1dab106d3a2df0f21", 
                per_page:12, 
                format:"json",
                nojsoncallback:1, 
                privacy_filter : 1,
                tags: flickr.tag
            }
        }
    }

    if(flickr.type == "userid"){
        result_flickr = {
            url:"https://www.flickr.com/services/rest/?method=flickr.people.getPhotos",
            dataType:"json",
            data:{
                api_key:"645bbdf320519f9a5473a288fc9f617a",
                per_page:12,
                format:"json",
                nojsoncallback:1,
                privacy_filter: 1,
                user_id: flickr.user_id
            }
        }
    }

    $.ajax(result_flickr)
    .success(function(data){
        console.log(data.photos.photo);
    
        let items = data.photos.photo;
        this.creatList(items);
        this.loadImg();
    }.bind(this))
    .error(function(err){
        console.err("데이터를 호출하는 데 실패했습니다.");
    })
}

MyFlick.prototype.creatList = function(items){
    this.gallery.empty();
    this.gallery.append("<ul>");

    $(items).each(function(index, data){
        let num = index+1;

        this.gallery.children("ul").append(
            $("<li>")
                .append(
                    $("<a>").attr({
                        href : "https://live.staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_b.jpg"
                    })
                    .append(
                        $("<img>").attr({
                            src : "https://live.staticflickr.com/"+data.server+"/"+data.id+"_"+data.secret+"_b.jpg"
                        })
                    ),
                )
                .append(
                    $("<h2>").text("2021 PROJECT"),
                    $("<p>").text(data.owner).append(
                        $("<span>").text("0" + num + "/")
                    )
                )
        )
    }.bind(this));
}

MyFlick.prototype.loadImg = function(){
    const total = this.gallery.find("li").length;
    let imgLen = 0;

    this.gallery.find("img").each(function(index, data){

        data.onerror = function(){
            $(data).attr("src", "img/default.jpg");
        }
        
        data.onload = function(){            
            imgLen++;

            if(imgLen === total){ 
                $(".loadImg").addClass("off");
                this.gallery.children("ul").addClass("on");
            }
        }        
    }.bind(this)); 
}