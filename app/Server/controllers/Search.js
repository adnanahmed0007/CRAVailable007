import DonorBloodDonationexport from "../models/DonorBlooddonation.js";

import BloodRequiredexport from "../models/BloodRequired.js";
const Search = async (req, res, next) => {
    const user = req.user;

    try {
        const { bloodGroup, NearestHospital, phone, query } = req.body;

        if (bloodGroup && NearestHospital && phone && query) {
            const newdataBloodrequired = new BloodRequiredexport({
                bloodGroup: bloodGroup,
                NearestHospital: NearestHospital.trim(),
                phone: phone,
                query: query.trim(),

            })

            await newdataBloodrequired.save();



            const fectchadat = await DonorBloodDonationexport.find({
                bloodGroup: bloodGroup.trim(),
                NearestHospital: { $regex: new RegExp(NearestHospital.trim(), "i") },
            });
            console.log(fectchadat)
            if (fectchadat.length == 0) {
                return res
                    .status(404)
                    .json({
                        message: "no blood group is there"
                    })
            }
            else {
                console.log(fectchadat);
                return res
                    .status(200)
                    .json({
                        message: "we got the blood ate the nearest hospital",
                        fectchadat
                    })
            }

        }
        else {
            return res
                .status(400)
                .json({
                    message: "all credentials are required"
                })
        }
    }
    catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({
                message: "internal server erroe"
            })
    }

}
export default Search;