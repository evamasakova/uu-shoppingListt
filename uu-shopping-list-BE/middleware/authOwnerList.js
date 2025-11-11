const { router } = require("../app");
const List = require("../models/lists");

const authorizeOwnerList = async (req, res, next) => {
  try {
    const listId = req.params.id || req.params.shoppingListId;
    const bearerString = req.headers["authorization"];
    const token = bearerString.split(" ")[1];
    
    //1. vytáhnout z tokenu userId

    /*const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    if (list.creatorId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized — owner access only" });
    }
    */
    //2. ukázka res.locals - pak taky smazat nebo předělat
    res.locals.mreraser = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error during authorization" });
  }
};
module.exports = authorizeOwnerList;
/*
//example
let auth = (req, res, next) => {
  let isPassCorrect = false;  
  if (isPassCorrect) {
    res.locals.user = { auth: true };
    res.locals.token = "213";
    return next(); //z auth -> do handleData
  }
  res.status(404).send({
    msg: "Wrong pass!",
  });
};

let handleData = (req, res, next) => {
    //db
    let userData = res.locals.user;
    //db
    return next(); //z handleData -> sendData
};

let sendData = (req, res, next) => {
    //res.send();
};

router.post("/a", auth, handleData, sendData);
*/