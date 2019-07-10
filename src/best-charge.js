
//const  barcodesArray = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

//function bestCharge(selectedItems) {
 // return /*TODO*/;
//}
function bestCharge(barcodesArray){
  var cartItemsArray=formatItemObject(barcodesArray)
  var totalInfoObj=colculateTotal(cartItemsArray)
  var itemsStr=''
  for(let item of cartItemsArray){
    itemsStr+=item.name+" x "+item.quantity+" = "+item.price*item.quantity+"元\n"
  }
  itemsStr+="-----------------------------------"
  var promotionStr='使用优惠：\n'+totalInfoObj.type+"\n-----------------------------------"
  var totalSre='总计：'+totalInfoObj.total+"元\n"+"==================================="
  var receiptStr=`
============= 订餐明细 =============
${itemsStr}
${totalInfoObj.isPromotion?promotionStr:""}
${totalSre}`
  return receiptStr
}
function colculateTotal(cartItemsArray){
  //var cartItemsAry=cartItemsArray
  var totalArray=[]
  var saveTotal=[]
  var promotionWays=loadPromotions();
  var totalOri=null
  var promoItems=[]
  for(let cartItem of cartItemsArray){
    totalOri+=cartItem.price*cartItem.quantity
  }
  totalArray.push(totalOri)
  for(let promotionWay of promotionWays){
    if(totalOri>=30 && promotionWay.type==='满30减6元'){
      let total=null
      let saveMoney=null
      for(let cartItem of cartItemsArray){
        total +=cartItem.price*cartItem.quantity
      }
      if(total>=30){
        saveMoney=Math.floor(total/30)*6
        total=total-saveMoney
        saveTotal.push(saveMoney)
      }else{
        saveTotal.push(0)
      }
      totalArray.push(total)
    }
    else if(promotionWay.type==='指定菜品半价'){
      let total=null
      let saveMoney=null
      for(let cartItem of cartItemsArray){
        if(promotionWay.items.indexOf(cartItem.id)!=-1){
          total+=cartItem.price/2*cartItem.quantity
          promoItems.push(cartItem.name)
        }else{
          total+=cartItem.price*cartItem.quantity
        }
      }
      saveMoney=totalOri-total
      totalArray.push(total)
      saveTotal.push(saveMoney ? saveMoney : 0)
    }
  }
  var totalObj={}
  var smallTotal=(Math.min.apply(null, totalArray))
  totalObj.total=smallTotal
  var bigSaveMoney=(Math.max.apply(null,saveTotal))
  totalObj.saveMoney=bigSaveMoney
  
  if(totalArray.indexOf(smallTotal)===0){
    totalObj.type=null
    totalObj.isPromotion=false
  }else if(totalArray.indexOf(smallTotal)===1){
    totalObj.type='满30减6元，'+"省"+totalObj.saveMoney+"元"
    totalObj.isPromotion=true
  }else if(totalArray.indexOf(smallTotal)===2){
    totalObj.type='指定菜品半价'+"("+promoItems.join('，')+")，"+"省"+totalObj.saveMoney+"元"
    totalObj.isPromotion=true
  }
  return totalObj
  
}
function formatItemObject(barcodesArray){
  var database=loadAllItems()
  var itemQuantity=colculateItemQuantity(barcodesArray)
  var cartItem=[]
  for(let item of Object.keys(itemQuantity)){
      for(let dbItem of database)
      if(dbItem.id==item)
      {
          let objItem={}
          objItem.id=dbItem.id;
          objItem.name=dbItem.name;
          objItem.price=dbItem.price;
          objItem.quantity=itemQuantity[item]
          cartItem.push(objItem) 
      }
  }

  return cartItem;
}
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
//bestCharge(barcodesArray)