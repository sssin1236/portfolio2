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
class MyFlickr{
    constructor(options){
        this.init(options);
        this.bindingEvent();
    }
    
    init(options){
        this.gallery = $(options.selector);
        this.search = $(options.searchBox);
        this.btnSearch = this.search.find("a");
        this.input = this.search.find("input");
        this.logo = $(options.logo);
        this.user_id = options.userId;
        this.apiKey = options.apiKey;
        this.perPage = options.perPage;
        this.loadingImg = options.loadingImg;
    }
    
    bindingEvent(){
        this.getList({
            type: "userid",
            user_id: this.user_id
        });
        
        this.btnSearch.on("click", e=>{
            e.preventDefault();
        
            var search = this.input.val();
            
            if(!search){
                this.input.attr("placeholder", "검색어를 입력하세요.");
                this.input.focus();
                this.input.on("focusout", ()=>{
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
        });
        
        $(window).on("keypress", e=>{
            if(e.keyCode == 13){
                var search = this.input.val();
            
                if(!search){
                    this.input.attr("placeholder", "검색어를 입력하세요.");
                    this.input.focus();
                    this.input.on("focusout", ()=>{
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
        });
        
        
        this.logo.on("click", ()=>{
            this.gallery.children("ul").removeClass("on");
            $(".loadImg").removeClass("off");
        
            this.getList({
                type: "userid",
                user_id: this.user_id
            });
        });
        
        $("body").on("click", this.gallery.selector+" ul li", e=>{
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
        
        $("body").on("click", ".pop span", ()=>{
            $(".pop").fadeOut();
        });
    }
    
    
    
    getList(flickr){
        let result_flickr = {};
    
        if(flickr.type =="interest"){
            result_flickr = {
                url:"https://www.flickr.com/services/rest/?method=flickr.interestingness.getList",
                dataType:"json",
                data:{
                    api_key:this.apiKey,
                    per_page:this.perPage,
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
                    api_key:this.apiKey, 
                    per_page:this.perPage, 
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
                    api_key:this.apiKey,
                    per_page:this.perPage,
                    format:"json",
                    nojsoncallback:1,
                    privacy_filter: 1,
                    user_id: flickr.user_id
                }
            }
        }
    
        $.ajax(result_flickr)
        .success(data=>{
        
            let items = data.photos.photo;
            this.creatList(items);
            this.loadImg();
        })
        .error(err=>{
            console.err("데이터를 호출하는 데 실패했습니다.");
        })
    }
    
    creatList(items){
        this.gallery.empty();
        this.gallery.append("<ul>");
    
        $(items).each((index, data)=>{
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
        });
    }
    
    loadImg(){
        const total = this.gallery.find("li").length;
        let imgLen = 0;
    
        this.gallery.find("img").each((index, data)=>{
    
            data.onerror = ()=>{
                $(data).attr("src", this.loadingImg);
            }
            
            data.onload = ()=>{            
                imgLen++;
    
                if(imgLen === total){ 
                    $(".loadImg").addClass("off");
                    this.gallery.children("ul").addClass("on");
                }
            }       
        }); 
    }
}

