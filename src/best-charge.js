

function bestCharge(barcodesArray){
  var cartItemsArray=formatItemObject(barcodesArray)
  var itemsStr = makeCartItemsStr(cartItemsArray);
  var totalInfoObj=buildObjectTotalInfo(cartItemsArray)
  var promotionStr=`
使用优惠:
${totalInfoObj.type}
-----------------------------------`

  if(totalInfoObj.isPromotion){
    itemsStr +=promotionStr
  }

  var totalSre=`总计：${totalInfoObj.total}元
===================================`

  //拼接最后输出字符串
  var receiptStr=`
============= 订餐明细 =============
${itemsStr}
${totalSre}`


  return receiptStr
}

//计算每个物品数量记录在物品Object中
function colculateItemQuantity(barcodesArray){
  var objItem={}
  for(let item of barcodesArray){
    var itemArray=item.replace(/\s+/g,"").split("x")
    let key=itemArray[0]
    let quantity=Number(itemArray[1])
    objItem[key]=quantity
  }
  return objItem
}
function formatItemObject(barcodesArray){
  var database=loadAllItems()
  var itemQuantity=colculateItemQuantity(barcodesArray)
  var cartItems=[]
  for(let item of Object.keys(itemQuantity)){
    for(let dbItem of database)
      if(dbItem.id==item)
      {
        let objItem={}
        objItem.id=dbItem.id;
        objItem.name=dbItem.name;
        objItem.price=dbItem.price;
        objItem.quantity=itemQuantity[item]
        cartItems.push(objItem)
      }
  }

  return cartItems;
}
function makeCartItemsStr(cartItemsArray) {
  var itemsStr = ''
  for (let item of cartItemsArray) {
    itemsStr+= `${item.name} x ${item.quantity} = ${item.price * item.quantity}元\n`
  }
  itemsStr += "-----------------------------------"
  return itemsStr;
}

function totalByFistPromotionWaySavaToArray(cartItemsArray, saveTotalArray, totalArray) {
  let total = null
  let saveMoney = null
  for (let cartItem of cartItemsArray) {
    total += cartItem.price * cartItem.quantity
  }
  if (total >= 30) {
    saveMoney = Math.floor(total / 30) * 6
    total = total - saveMoney
    saveTotalArray.push(saveMoney)
  } else {
    saveTotalArray.push(0)
  }
  totalArray.push(total)

}

function totalBySecondPromotionWaySaveToArray(cartItemsArray, promotionWay, promoItems, totalOri, totalArray, saveTotalArray) {
  let total = null
  let saveMoney = null
  for (let cartItem of cartItemsArray) {
    if (promotionWay.items.indexOf(cartItem.id) != -1) {
      total += cartItem.price / 2 * cartItem.quantity
      promoItems.push(cartItem.name)
    } else {
      total += cartItem.price * cartItem.quantity
    }
  }
  saveMoney = totalOri - total
  totalArray.push(total)
  saveTotalArray.push(saveMoney ? saveMoney : 0)

}

function buildObjectOfBestPriceAndFormatPriceInfo(totalArray, saveTotalArray, promoItems) {
  var totalObj = {}
  var smallTotal = (Math.min.apply(null, totalArray))
  totalObj.total = smallTotal
  var bigSaveMoney = (Math.max.apply(null, saveTotalArray))
  totalObj.saveMoney = bigSaveMoney

  if (totalArray.indexOf(smallTotal) === 0) {
    totalObj.type = null
    totalObj.isPromotion = false
  } else if (totalArray.indexOf(smallTotal) === 1) {
    totalObj.type=`满30减6元，省${totalObj.saveMoney}元`
    totalObj.isPromotion = true
  } else if (totalArray.indexOf(smallTotal) === 2) {
    totalObj.type=`指定菜品半价(${promoItems.join('，')})，省${totalObj.saveMoney}元`
    totalObj.isPromotion = true
  }
  return totalObj;
}

function buildObjectTotalInfo(cartItemsArray){
  var totalArray=[]
  var saveTotalArray=[]
  var promotionWays=loadPromotions();
  var totalOri=cartItemsArray.reduce((acc,item)=>{
    return acc+item.price*item.quantity;
  },0)
  var promoItems=[]//记录优惠项
  totalArray.push(totalOri)
  for(let promotionWay of promotionWays){
    if(totalOri>=30 && promotionWay.type==='满30减6元'){
      totalByFistPromotionWaySavaToArray(cartItemsArray, saveTotalArray, totalArray);
    }
    else if(promotionWay.type==='指定菜品半价'){
      totalBySecondPromotionWaySaveToArray(cartItemsArray, promotionWay, promoItems, totalOri, totalArray, saveTotalArray);
    }
  }
  var totalObj = buildObjectOfBestPriceAndFormatPriceInfo(totalArray, saveTotalArray, promoItems);
  return totalObj
  
}



