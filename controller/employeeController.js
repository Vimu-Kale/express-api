const Employee = require("../model/employee");

const handleFilderByDate = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const employees = await Employee.find({
      startDate: startDate,
      endDate: endDate,
    });
    if (employees) {
      res.status(200).json({ success: true, payload: employees });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Error While Fetching Details" });
    }
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Error While Fetching Details",
      ErrMsg: e,
    });
  }
};

const handleSortByName = async (req, res) => {
  try {
    let ASE_DESC = 0;
    if (req.query.value == 0) {
      ASE_DESC = 1;
    }
    if (req.query.value == 1) {
      console.log("hii");
      ASE_DESC = -1;
    }
    console.log(ASE_DESC);

    const employees = await Employee.find().sort({ name: ASE_DESC });
    console.log(employees);
    if (employees) {
      res.status(200).json({ success: true, payload: employees });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Error While Fetching Details" });
    }
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Error While Fetching Details",
      ErrMsg: e.message,
    });
  }
};

module.exports = {
  handleFilderByDate,
  handleSortByName,
};
