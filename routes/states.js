const express = require('express');
//const { default: regex } = require('uuid/dist/regex');
const router = express.Router();
const StatesDB = require('../../model/States');
const data = {};
data.states = require('../../model/states.json');

// get all states = /states/ All state data returned
// /states/?contig=true All state data for contiguous states (Not AK or HI)
// /states/?contig=false All state data for non-contiguous states (AK, HI)
router.route('/')
    .get((req, res) => {
        let states = data.states
        states = (req.query.contig === 'true') ? states.filter(state => state.code !== 'AK' && state.code !== 'HI')
        : (req.query.contig === 'false') ? states = states.filter(state => state.code === 'AK' || state.code === 'HI')
        : states;

        res.json(states)
    });

// get single state = /states/:state All data for the state URL parameter
router.route('/:state')
    .get((req, res) => {
        let state = data.states.find((state) => state.code === req.params.state.toUpperCase());
        if (!state) {
            return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
        } else {
        res.json(state);
        }
    });

// /states/:state/funfact A random fun fact for the state URL parameter
router.route('/:state/funfacts')
    .get((req, res) => {
        let fact = StatesDB.findOne({ stateCode: req.params.stateCode.toUpperCase()}).exec();
        if (!req?.params?.state) {
            return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
        }
        res.json(fact);
    })
    .post((req, res) => {
        let result = StatesDB.create({
            stateCode: req.body.stateCode,
            funfacts: req.body.funfacts
        });
        res.status(201).json(result);
    })
    .put((req, res) => {
        res.status(201).json(result);
    })
    .delete((req, res) => {
        res.status(201).json(result);
    });

// get state and capital = /states/:state/capital { ‘state’: stateName, ‘capital’: capitalName }
router.route('/:state/capital')
    .get((req, res) => {
        let state = data.states.find((state) => state.code === req.params.state.toUpperCase());
        if (!state) {
            return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
        } else {
            res.json({ state: `${state.state}`, capital: `${state.capital_city}` });
        }
    });

// get state and nickname = /states/:state/nickname { ‘state’: stateName, ‘nickname’: nickname }
router.route('/:state/nickname')
    .get((req, res) => {
        let state = data.states.find((state) => state.code === req.params.state.toUpperCase());
        if (!state) {
            return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
        } else {
        res.json({ state: `${state.state}`, nickname: `${state.nickname}` });
        }
    });

// get state and population = /states/:state/population { ‘state’: stateName, ‘population’: population }
router.route('/:state/population')
    .get((req, res) => {
        let state = data.states.find((state) => state.code === req.params.state.toUpperCase());
        if (!state) {
            return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
        } else {
        res.json({ state: `${state.state}`, population: `${state.population}` });
        }
    });

// /states/:state/admission { ‘state’: stateName, ‘admitted’: admissionDate }
router.route('/:state/admission')
    .get((req, res) => {
        let state = data.states.find((state) => state.code === req.params.state.toUpperCase());
        if (!state) {
            return res.status(400).json({ message: 'Invalid state abbreviation parameter'})
        } else {
            res.json({ state: `${state.state}`, admitted: `${state.admission_date}` })
        };
    });

module.exports = router;