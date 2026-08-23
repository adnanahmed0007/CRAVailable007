import BloodRequiredexport from "../models/BloodRequired.js";

const ViewAllBloodrequired = async (req, res, next) => {
    try {

        console.log("hello")
        const findAll = await BloodRequiredexport.find();

        if (findAll.length > 0) {
            res.status(200).json({ success: true, findAll: findAll });
        }
        else {
            res
                .status(404)
                .json({ message: "no blood is found" })

        }

    }
    catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "internal server error" })
    }
}
export default ViewAllBloodrequired