//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require('mongoose');
const _=require("lodash");

const app=express();
app.set('view engine','ejs');

const workItems=[];
app.set('view engine','ejs');
//var items=["Home work","Exercise"];
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin-krishna:krishna123@cluster0-4tom9.mongodb.net/todolistDB",{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
//const Schema=mongoose.Schema;

const itemsSchema={
    name:String
};

const Item=mongoose.model("Item",itemsSchema);
const todo1=new Item({
    name:"Home work"
});

const todo2=new Item({
    name:"hit check list to complete"
});

const todo3=new Item({
    name:"hit + to add"
});
const defoultItems=[todo1,todo2,todo3];

const listSchema={
    name:String,
    items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

// Item.find({},function(err){
//     if(err){
//         console.log(err);
//     }
// });

app.get("/",function(req,res){
    Item.find({},function(err,found){
        if(found.length===0){
    Item.insertMany(defoultItems,function(err){
    if(err)
    console.log(err);
    else
    console.log("successfully inserted");
    });    
        res.redirect("/");
}
        else{
        res.render("list",{listTitle:"Today",newListItem:found});
        }
    });
    
    
})

app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;

    const item=new Item({
        name:itemName
    });
    if(listName==="Today"){
        item.save(); 
    res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            if(err) console.log(err);
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work list",newListItem:workItems});
})

app.get("/about",function(req,res){
    res.render("about");
})

app.get("/:paras",function(req,res){
    const customList=_.capitalize(req.params.paras);
  
    List.findOne({name:customList},function(err,foundList){
        if(!err){
            if(!foundList){
                //console.log("not exists!");
                const list=new List({
                    name:customList,
                    items:defoultItems
                });
                list.save();
                res.redirect("/"+customList);    
            }
            else
            //console.log("exists");
            res.render("list",{listTitle:customList,newListItem:foundList.items});
        }
        
    })
    
})


app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(!err)
            console.log("deleted !");
            res.redirect("/");
        });
        
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
    
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(3000,function(){
    console.log("Server is runing")
})