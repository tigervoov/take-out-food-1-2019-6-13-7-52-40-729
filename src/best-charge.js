function bestCharge(selectedItems) {
  return /*TODO*/;
}
function colculateItemQuantity(){
  let barcodesArray = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
  var objItem={}
  for(let item of barcodesArray){
    var itemArray=item.replace(/\s+/g,"").split("x")
    let key=itemArray[0]
    let quantity=Number(itemArray[1])
    objItem[key]=quantity add 
  }
  return objItem
}
colculateItemQuantity()