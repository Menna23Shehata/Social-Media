import ApiFeatures from "../APIFeatures.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import AppError from "../services/AppError.js";


const deleteOne = (model) => {
    return catchAsyncError(async (req, res, next) => {
        let { id } = req.params;
        let results = await model.findByIdAndDelete(id);
        !results && next(new AppError("not found Brand", 404));
        results && res.json({ message: "Done", results });
    });

}
const getAll = (model)=>{
    return catchAsyncError(async (req, res, next) => {
        let apiFeature = new ApiFeatures(model.find(), req.query).pagination().sort().search().fields();
        let results = await apiFeature.mongooseQuery;
        res.json({ message: "Success", results });
    })
}


export {deleteOne,getAll}