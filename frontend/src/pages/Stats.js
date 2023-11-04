import axios from "axios";
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Spotlight from "../components/stats/Spotlight";
import Progress from "../components/stats/Progress";
import { Col, Row } from "react-bootstrap";
import useToken from "../hooks/useToken";
// import * as All from '../imgs';

/* eslint-disable no-unused-vars */
let username = JSON.parse(sessionStorage.getItem("username"));

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export const Stats = () => {
  const { token } = useToken();
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;

  const [s, setS] = useState([]);
  const [achievements, setAchievements] = useState([]);

  console.log("s", s);
  //console.log(achievements)

  useEffect(() => {
    // this should be the url to get all confidences
    const fetchSkills = async () => {
      try {
        const { data: skillsData } = await axios.get(
          "http://localhost:8000/confidence/skill_assessment/"
        );
        console.log("data:");
        console.log(Object.entries(skillsData));
        setS(Object.entries(skillsData));
      } catch (error) {
        console.log(error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchAchieve = async () => {
      try {
        await axios.post("http://localhost:8000/achievements/add-achievement/");
        const { data: achieveData } = await axios.get(
          "http://localhost:8000/achievements/list-achievement/"
        );
        console.log("dachieve ata:");
        console.log(achieveData[0]);
        setAchievements(achieveData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAchieve();
  }, []);

  function getMax(skills) {
    // this should be the url to get all user achievements
    var maxSkill = ["", 0];
    console.log(skills.length);
    for (var i = 0; i < skills.length; i++) {
      console.log(skills[i][1]);
      if (maxSkill[1] < Number(skills[i][1])) {
        maxSkill = skills[i];
        console.log("i");
        console.log(skills[i]);
      }
    }
    console.log("called");
    console.log(maxSkill);
    return maxSkill;
  }

  function getCount(skills) {
    // this should be the url to get all user achievements
    var num = 0;
    for (var i = 0; i < skills.length; i++) {
      if (100 === skills[i][1]) {
        // count should be max possible of skill
        console.log("printing", skills[i]);
        num += 1;
      }
    }
    return num;
  }

  //   <button onClick={() => setCount(count + 1)}>Increment</button>

  return (
    <div>
      <Container className="pt-5 pb-5">
        {" "}
        {/* cards for highest skill, total time coding, average time coding, etc */}
        <h1 className="display-1">Statistics</h1>
        <h3>
          This page contains your statistics, progress in each skill, and
          achievements.
        </h3>
        <div className="row mt-1 mb-1">
          <Row style={{ height: "25rem" }} className="text-center mb-5">
            <Col sm={4}>
              <Spotlight
                name={"Highest Skill"}
                desc={"Your highest skill is: "} // get highest skill from a user query
                stat={getMax(s)[0]} // fix this to say the name
              />
            </Col>
            <Col sm={4}>
              <Spotlight
                name={"Highest Proficiency"}
                desc={"The proficiency of your highest skill is: "} // get time spent from an attempt query
                stat={getMax(s)[1]}
              />
            </Col>
            <Col sm={4}>
              <Spotlight
                name={"Number of Skills Maxed Out"}
                desc={"The number of skills you've maxxed out is: "}
                stat={getCount(s)}
              />
            </Col>
          </Row>
        </div>
        <div className="row mt-1 mb-1">
          <h3>Skill Progress</h3>
          <div className="row mt-1">
            <ul>
              {s.map((skill) => (
                <Progress key={skill[0]} name={skill[0]} value={skill[1]} />
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Stats;
/* eslint-enable no-unused-vars */
