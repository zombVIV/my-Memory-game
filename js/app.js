/*
 * 创建一个包含所有卡片的数组
 */
var cards1=['<li class="card "><i class="fa fa-diamond"></i></li>',
'<li class="card "><i class="fa fa-diamond"></i></li>',
'<li class="card "><i class="fa fa-paper-plane-o"></i></li>',
'<li class="card "><i class="fa fa-paper-plane-o"></i></li>',
'<li class="card "><i class="fa fa-anchor"></i></li>',
'<li class="card "><i class="fa fa-anchor"></i></li>',
'<li class="card "><i class="fa fa-bolt"></i></li>',
'<li class="card "><i class="fa fa-bolt"></i></li>',
'<li class="card "><i class="fa fa-cube"></i></li>',
'<li class="card "><i class="fa fa-cube"></i></li>',
'<li class="card "><i class="fa fa-leaf"></i></li>',
'<li class="card "><i class="fa fa-leaf"></i></li>',
'<li class="card "><i class="fa fa-bicycle"></i></li>',
'<li class="card "><i class="fa fa-bicycle"></i></li>',
'<li class="card "><i class="fa fa-bomb"></i></li>',
'<li class="card "><i class="fa fa-bomb"></i></li>'];

var cards2=[];//洗后数组
var time//时间
var moves//步数
var stars//星星
var clickcard//点卡片
var firstcard//匹配的第一张
/*
$(document).ready(function(){
    Initialization();
    Clickcard();
  });
*/

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
     //虽然仍有元素洗牌…
    while (currentIndex !== 0) {
        //选择一个剩余元素…
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        //并将其与当前元素进行交换
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function Initialization(){
    clickcard = 0;
    time = 0;
    moves = 0;
    stars = 3;
    matchedCard.splice(0,matchedCard.length);
    $('.moves').html(moves);
    $('#star1' ).css('display','inline-block');
    $('#star2' ).css('display','inline-block');    
   let cards2 = shuffle(cards1);
    $('.card').remove();//移除原来的子元素
    for(var j = 0; j <= cards2.length;j++){
          //循环遍历每张卡片，创建其 HTML
        $(".deck").append(cards2[j]);
    
 };
   
};//初始化函数
 let openCard=[];
 let matchedCard=[];
$('.restart').click(function(){
    Initialization();
    
}); //点击初始化
 $(document).ready(function(){
    Initialization();
    //页面加载后先初始化
    $('.deck').on('click','li',function(ev){
        //总点击卡片事件
         let tcard=$(this);
        if(clickcard === 0){
            clickcard === 1;
            timer();
        };// 第一次点卡的时候进行计时（计时器事件）
        console.log(this);

        setTimeout(function(){
            gameover();
        },1000);

        //下面if开始点击卡片事件
        if(tcard.hasClass("open show")===false){
            //当这张卡没有“open show”时命令有效
            console.log(this);
           if(openCard.length < 2 && tcard.hasClass("match")===false ){
            $(this).toggleClass("open show");
            //显示卡片
            $(ev.delegateTarget).toggleClass("open show");
            //委托对象ul
            let t=$(this).find("i").attr("class");
            openCard.push(t);
            //提取图片的类的属性到数组
            console.log(this);

           };//点击一张if事件end
           if(openCard.length === 2 && openCard[0] === openCard[1]){
               // 翻了两张卡且两张卡相同的时候1
            $(".card.open").addClass("match");
            //翻开的卡片才能被添加‘match’
            matchedCard.push(openCard[0]);
            matchedCard.push(openCard[1]);
            //加入锁定数组
            openCard.splice(0,2);
            //清除打开卡片数组
            console.log(this);

           }else if(openCard.length === 2 && openCard[0] !== openCard[1]){
               //点击第二张卡片，两张卡片不相同时2
               // 隐藏卡片时设定延时函数（延迟隐藏显示600豪秒）
               setTimeout(function(){
                $(".card,.open,.show").removeClass("open show");
                // 隐藏卡片，选取所有 class 为 card 或 open 或 show 的元素
                openCard.splice(0,2);
                // 清空已打开的卡片的数组
                }, 600);
                console.log(this);
                              
           }//翻两张卡的两种情况end
        moves+=1;
        //点击一次卡片步数加1
        $('.moves').html(moves);
        //在页面显示当前步数
        Starrating1();
        //计时函数
        console.log(this);

        }//点击卡片事件end

    });//点击卡片事件加计时器事件end

 });//页面加载事件end
/*
论坛上给的思路
这里贴个核心思路，严格按照这个思路写代码，就不会错：

首先需要确定使用事件委托，在所有卡牌的父元素上设置监听器
然后，确保每次点击的事件仅对未打开的卡牌有效（排除已经匹配的和已经翻开的牌）
每次点击卡牌翻开卡牌（函数 displayCardSymbol），同时，将这张牌放入一个表示当前打开的卡牌的数组 openCards（函数 addCardToOpenCards）
当openCards 中包含两张卡牌时，进行对比
如果卡牌相同，则匹配相关操作（函数 lockMatchedCard，在此函数中将匹配卡牌放入数组 matchedCards ，注意检查 matchedCards 是否达到所有卡牌的数量总和，如果达到就赢了，显示隐藏的胜利信息 modal 窗口）
如果卡牌不同，则卡牌翻过去恢复隐藏状态（函数 hideCardSymbol）
对应的核心代码 （jQuery） 版，注意其中有大量函数，需要自己去实现，这里只提供思路和正确代码逻辑
// 页面加载完成后时
$(document).ready(function() {
  resetGameData();
  // 点击卡牌事件
  $deck.on("click", "li", function(e) {
    const target = $(this);
    // 只有第一次打开卡牌的时候，启动计时器
    if (firstClick) {
      timer();
      firstClick = false;
    }
    // 确保仅对未打开的卡牌有效
    if (!target.hasClass("open")) {
      displayCardSymbol(target);
      addCardToOpenCards(target);
      if (openCards.length === 2) {
        showStepNum();
        // 判断卡牌是否匹配
        // 三元操作符
        getClassOfCardIcon(openCards[0]) === getClassOfCardIcon(openCards[1])
          ? lockMatchedCard()
          : hideCardSymbol();
      }
    }
  });
*/
//  游戏结束函数
function gameover(){
    //16张全匹配完成后执行
if(matchedCard.length === 16){
    //点击卡片状态为0
    clickcard === 0
    //弹出对话框
    alert("You are success! Star rating: "+stars+",Time: "+time);
    //游戏初始化
    Initialization();

}
};
//计时函数setTimeout延迟
function timer(){
    $('.gametime').html(time);
         time++;
          setTimeout(function(){
            timer();
          },4000);
       
};//计时器1000毫秒运行一次函数end

//星星评定函数
function Starrating1(){
    
    if(moves > 20){
        $('#star1' ).css('display','none');//第一个星星消失
        stars=2; 
    }
    if(moves > 40){
        $('#star2').css('display','none');//第二颗星星消失
        stars=1;
    }
    
};// 星星评定end
/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
