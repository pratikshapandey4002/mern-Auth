import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("database Connected");
    }
    catch(err){
        console.log("database Connection Failed");
        console.log(err);
        process.exit(1);
    }
}
export default ConnectDB;