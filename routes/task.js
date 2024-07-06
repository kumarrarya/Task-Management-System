const router = require("express").Router();
const Task= require("../models/Task");
const User= require("../models/user");
const authenticateToken = require("./auth");
router.post("/create_task",authenticateToken, async (req,res)=>{
    try {
        console.log("here:");
        const {title,desc} = req.body;
        const {id} =req.headers;
        const newTask = new Task({
            title:title,
            desc:desc
        })
        const saveTask = await newTask.save();
        const taskId = saveTask._id;
        await User.findByIdAndUpdate(id,{$push:{tasks:taskId}});
        res.status(200).json({message:"Task Created"});

    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }

});


router.get("/get_all_tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
                path:"tasks",
                options:{sort:{createdAt:-1

            }}
        });
        res.status(200).json({data:userData});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// delete_task
router.delete("/delete_task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const userId=req.headers.id;
        await Task.findByIdAndDelete(id)
        await User.findByIdAndUpdate(userId,{$pull:{tasks:id}});
        res.status(200).json({message:"task Deleted Succesfuly"});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// update Task
router.put("/update_task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const {title,desc} = req.body;
        await Task.findByIdAndUpdate(id,{title:title,desc:desc});
        res.status(200).json({message:"task Updated Succesfuly"});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// update-important-task
router.put("/update_imp_task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        console.log("id:",id);
        const TaskData = await Task.findById(id);
        console.log("taskData:",TaskData);
        const ImpTask =TaskData.important;
        await Task.findByIdAndUpdate(id,{important:!ImpTask});

        res.status(200).json({message:"task Updated Succesfuly"});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// update_complete-task
router.put("/update_com_task/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        
        const TaskData = await Task.findById(id);
        const CmpTask =TaskData.completed;
        await Task.findByIdAndUpdate(id,{completed:!CmpTask});

        res.status(200).json({message:"task updated Succesfuly"});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// important_data_fetch

router.get("/get_imp_tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
                path:"tasks",
                match:{important:true},
                options:{sort:{createdAt:-1

            }}
        });
        res.status(200).json({data:userData});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// get completed task
router.get("/get_comp_tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const data = await User.findById(id).populate({
                path:"tasks",
                match:{completed:true},
                options:{sort:{createdAt:-1

            }}
        });
        const ImpTask = data.tasks;
        res.status(200).json({data:ImpTask});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// get incompleted task
router.get("/get_incomp_tasks", authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const data = await User.findById(id).populate({
                path:"tasks",
                match:{completed:false},
                options:{sort:{createdAt:-1

            }}
        });
        const ImpTask = data.tasks;
        res.status(200).json({data:ImpTask});
    } catch (error) {
        console.error("Error:", error); // Log the actual error for debugging
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports=router;
