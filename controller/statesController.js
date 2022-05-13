const State = require("../model/States");
const { readFileSync } = require("fs");
const data = require("../model/states.json");

// const result = readFileSync("states.json");
// const data = JSON.parse(result);

//Get all states
const getStates = async (req, res) => {
  try {
    const { contig } = req.query;
    const { state } = req.params;
    if (contig) {
      const response = data;
      if (response.length === 0)
        return res.status(400).json({ message: "No state found." });
      let dbData = await State.find({});
      let finalData = response.map((item) => {
        let found = dbData.filter(
          (secondItem) => secondItem.stateCode === item.code
        );
        if (found.length === 0) return item;
        else return { ...item, funfacts: found[0].funfacts };
      });
      if (contig === "true")
        finalData = finalData.filter((state) => state.admission_number < 48);
      else
        finalData = finalData.filter((state) => state.admission_number >= 48);

      res.json(finalData);
    } else if (state) {
      let response = data.filter((item) => item.code === state);
      if (response.length === 0)
        return res.status(400).json({ message: "No state found." });
      let dbData = await State.find({});
      let finalData = dbData.filter(
        (secondItem) => secondItem.stateCode === response[0].code
      );
      if (finalData.length !== 0)
        response = [{ ...response[0], funfacts: finalData[0].funfacts }];
      res.json(response);
    } else {
      const response = data;
      if (!response)
        return res.status(400).json({ message: "No state found." });
      let dbData = await State.find({});
      let finalData = response.map((item) => {
        let found = dbData.filter(
          (secondItem) => secondItem.stateCode === item.code
        );
        if (found.length === 0) return item;
        else return { ...item, funfacts: found[0].funfacts };
      });
      res.json(finalData);
    }
  } catch (error) {
    console.log(error);
  }
};

const getStateFunfacts = async (req, res) => {
  try {
    const { state } = req.params;
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    let dbData = await State.find({});
    let finalData = dbData.filter(
      (secondItem) => secondItem.stateCode === response[0].code
    );
    if (finalData.length !== 0) response = { data: finalData[0].funfacts };
    else reposne = null;
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getStateCapital = async (req, res) => {
  try {
    const { state } = req.params;
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    const cResponse = {
      state: response[0].state,
      capital: response[0].capital_city,
    };
    res.json(cResponse);
  } catch (error) {
    console.log(error);
  }
};

const getStateNickName = async (req, res) => {
  try {
    const { state } = req.params;
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    const cResponse = {
      state: response[0].state,
      nickname: response[0].nickname,
    };
    res.json(cResponse);
  } catch (error) {
    console.log(error);
  }
};

const getStatePopulation = async (req, res) => {
  try {
    const { state } = req.params;
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    const cResponse = {
      state: response[0].state,
      population: response[0].population,
    };
    res.json(cResponse);
  } catch (error) {
    console.log(error);
  }
};

const getStateAdmissionDate = async (req, res) => {
  try {
    const { state } = req.params;
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    const cResponse = {
      state: response[0].state,
      admitted: response[0].admission_date,
    };
    res.json(cResponse);
  } catch (error) {
    console.log(error);
  }
};
//Create an State
const createFunFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { funfacts } = req.body;
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    const found = await State.find({ stateCode: response[0].code });
    let result = null;
    if (found.length === 0) {
      result = await State.create({
        stateCode: response[0].code,
        funfacts,
      });
    } else {
      let updatedArray = [...found[0].funfacts, ...funfacts];
      result = await State.findOneAndUpdate(
        { stateCode: response[0].code },
        { funfacts: updatedArray },
        { new: true }
      );
    }

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

//Create an State
const updateFunFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { funfacts, index } = req.body;
    if (index < 1)
      return res.status(400).json({ message: "No funfact found." });
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    const found = await State.find({ stateCode: response[0].code });
    let result = null;
    if (found.length === 0)
      return res.status(400).json({ message: "No state found." });
    else {
      found[0].funfacts[index - 1] = funfacts;
      let updatedArray = [...found[0].funfacts];
      result = await State.findOneAndUpdate(
        { stateCode: response[0].code },
        { funfacts: updatedArray },
        { new: true }
      );
    }

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

//Create an State
const deleteFunFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { index } = req.body;
    if (index < 1)
      return res.status(400).json({ message: "No funfact found." });
    let response = data.filter((item) => item.code === state);
    if (response.length === 0)
      return res.status(400).json({ message: "No state found." });
    const found = await State.find({ stateCode: response[0].code });
    let result = null;
    if (found.length === 0)
      return res.status(400).json({ message: "No state found." });
    else {
      found[0].funfacts.splice(index - 1, 1);
      let updatedArray = [...found[0].funfacts];
      result = await State.findOneAndUpdate(
        { stateCode: response[0].code },
        { funfacts: updatedArray },
        { new: true }
      );
    }

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getStates,

  getStateCapital,
  getStateNickName,
  getStatePopulation,
  getStateAdmissionDate,
  createFunFact,
  updateFunFact,
  deleteFunFact,
  getStateFunfacts,
};