import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,
  Pagination,
  Controller,
  EffectCube,
} from "swiper";
import "swiper/swiper-bundle.css";
import "./styles.css";
import APIController from "./APIController";

// import img1 from "https://techport.nasa.gov/file/2472";
// import img2 from "https://techport.nasa.gov/file/5012";
// import img3 from "https://techport.nasa.gov/file/2306";

SwiperCore.use([Navigation, Pagination, Controller, EffectCube]);

function App() {
  const [controlledSwiper, setControlledSwiper] = useState(null);
  const [swiperActiveIndex, setSwiperActiveIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [projectSlides, setProjectSlides] = useState([]);
  const [detailSlides, setDetailSlides] = useState([]);

  useEffect(() => {
    console.log("App, calling searchForProjects");
    console.log("REACT_APP_NASA_API_KEY:" + process.env.REACT_APP_NASA_API_KEY);
    (async () => {
      await APIController.searchForProjects(
        process.env.REACT_APP_NASA_API_KEY,
        // something like "neuro plasticity"
        // "James Webb Space Telescope"  //current favorite/biggish
        // "Dragonfly"  //looks good
        // "Joint Polar Satellite System"   //kinda meh
        //"Landsat 9"  //images aren't great
        // "Lucy" //images aren't great
        //"Mars Sample Return"  // too many results
        // "Comet Sample Return" // too many results (79)
        "Gamma-Ray Burst" // yup i like this  TODO: and it shows that i need to check for primary image, it's not always the first image, so I'll check the indicator I believe is there
        //"Psyche"  // not bad, it's an option
        //"CubeSat Plasma Lazer" // could be better, there's any variants of Cubesat, so might b
        //"Heliopause Electrostatic" // simple!  visual! it's a keeper
        //"Roman Space" // is like this, "Roman Space Telescope", which this is, returns only 1 result, but this one seems good
        // "Sub-Orbital Large Balloon"  // original test
        // Continue: https://www.technologyreview.com/2021/01/04/1015519/the-11-biggest-space-missions-of-2021/
        // Continue: https://www.nasa.gov/centers/ames/engineering/projects
        // Continue: https://www.nasa.gov/centers/ivv/services/ivvprojects_current.html
      ).then(async (projectsArray) => {
        console.log("projectsArray:" + JSON.stringify(projectsArray));
        setProjects(projectsArray);
        console.log("projects:" + JSON.stringify(projects));

        /////////////////////////////////
        var arProjectSlides = [];
        for (let i = 0; i < projectsArray.length; i += 1) {
          arProjectSlides.push(
            <SwiperSlide
              key={`slide-${i}`}
              style={{ backgroundPosition: "center", backgroundSize: "cover" }}
            >
              <div style={{ position: "relative" }}>
                <img
                  style={{ height: "300px", width: "300px" }}
                  src={projectsArray[i].primaryImageUrl}
                  alt={projectsArray[i].primaryImageUrl}
                />
              </div>
            </SwiperSlide>
          );
        }
        setProjectSlides(arProjectSlides);

        var projectDetailSlides = [];
        projectDetailSlides.push(
          <SwiperSlide key={`slideDef-${0}`} tag="li">
            <div>
              <div>{projectsArray[0].definition}</div>
            </div>
          </SwiperSlide>
        );
        projectDetailSlides.push(
          <SwiperSlide key={`slideTech-${0}`} tag="li">
            <div>
              <div>{projectsArray[0].exampleTechnologies}</div>
            </div>
          </SwiperSlide>
        );
        projectDetailSlides.push(
          <SwiperSlide key={`slideBene-${0}`} tag="li">
            <div>
              <div>{projectsArray[0].benefits}</div>
            </div>
          </SwiperSlide>
        );
        // Bonus images round, if there's more than 1 image available
        if (projectsArray[0].allImages.length > 1) {
          for (let imageItem of projectsArray[0].allImages) {
            if (projectsArray[0].primaryImageUrl !== imageItem.imageUrl) {
              console.log("imageItem.imageUrl:" + imageItem.imageUrl);
              projectDetailSlides.push(
                <SwiperSlide key={`slideImg-${imageItem.imageUrl}`} tag="li">
                  <div>
                    <img
                      style={{ height: "300px", width: "300px" }}
                      src={imageItem.imageUrl}
                      alt={imageItem.imageUrl}
                    />
                  </div>
                </SwiperSlide>
              );
            } // end if url matches
          } // end for
        } // end if images length

        setDetailSlides(projectDetailSlides);
        ///////////////////
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // NOTE:  I'm adding in DEFINITION, BENEFITS etc to be clear about what is being displayed for testing purposes
  // const dataNASA = [
  //   {
  //     id: "three-d-cube-effect",
  //     projectID: "13744",
  //     title: "10 meter Sub-Orbital Large Balloon Reflector",
  //     fill: "#53d7d1",
  //     imageUrl: "https://techport.nasa.gov/file/2472",
  //     definition:
  //       "DEFINITION1: Mechanical/structural integrity testing characterizes material properties, performance, and integrity to ensure reliable and safe structural components and verifies component performance under dynamic conditions and in cyclic processes.",
  //     exampleTechnologies:
  //       "TECHNOLOGIES1: Advanced Non-Conventional Schlieren Techniques; Temperature/Pressure Sensitive Paint; Advanced Force Measurement System; quick demate and remate T-0 couplers; composite materials repair, accelerated corrosion and material degradation testing, Smart Materials for Damage Detection; dynamic impact photogrammetry; high volume & high flow testing at high (6000psi) and ultra-high (>7500 psi) complex & high thrust propulsion systems testing",
  //     benefits: "BENEFITS1: your bank account will increase in size",
  //   },
  //   {
  //     id: "three-d-cube-effect",
  //     projectID: "14325",
  //     title: "10 meter Sub-Orbital Large Balloon Reflector (LBR)",
  //     fill: "#cec850",
  //     imageUrl: "https://techport.nasa.gov/file/5012",
  //     definition:
  //       "DEFINITION2: Flight and ground antennas provide more innovative effective apertures than those currently in operation, with high efficiency but lower mass per unit area and accurate pointing.",
  //     exampleTechnologies:
  //       "TECHNOLOGIES2: Deployable antennas; phased array antennas; atmospheric phase compensation for uplink arrays at Ka-Band; small-satellite distributed multiple input multiple output (MIMO); conformal, low-mass antenna systems; antenna array architecture enablers",
  //     benefits:
  //       "BENEFITS2: <p>A 10 meter class telescope free of ~99% of the Earth&rsquo;s atmospheric absorption in the far-infrared can be realized. The same telescope can also be used to perform sensitive, high spectral and spatial resolution limb sounding studies of the Earth&rsquo;s atmosphere in greenhouse gases and serve as a high flying hub for any number of telecommunications and surveillance activities.</p>",
  //   },
  //   {
  //     id: "three-d-cube-effect",
  //     projectID: "12150",
  //     title: "Sub-Scale Re-entry Capsule Drop via High Altitude Balloons",
  //     fill: "#f3acf6",
  //     imageUrl: "https://techport.nasa.gov/file/2306",
  //     definition:
  //       "DEFINITION3: Aerodynamic decelerators are deployable descent system components that generate aerodynamic forces on the spacecraft, principally drag for deceleration, and lift for guidance and control. Parachutes or parafoils are traditionally employed for this purpose, but other deployable or inflatable devices, attached or trailing, may scale more effectively to higher mass missions.",
  //     exampleTechnologies:
  //       "TECHNOLOGIES3: Supersonic Inflatable Aerodynamic Decelerator (SIAD); mechanically deployed decelerators and methods of active control; steerable and guided deployable decelerators; dual-mode attached decelerator systems; ballutes",
  //     benefits:
  //       "BENEFITS3: <p> \tEntry, Descent, and Landing (EDL) technologies have long been identified as one of the critical, highest risk components of an eventual Human Mission to Mars. Mars Design Reference Architecture (DRA) and EDL Systems Analysis studies have shown the mid L/D rigid aeroshell to be one of the leading candidate platforms to enable this mission. Currently this technology and capability in the Agency is not funded. We propose to develop an incremental EDL capability which will enable payload return and entry testbed capability for the eventual development of large mass Mars entry designs. This initial development effort will provide training in systems engineering, aerodynamics, GN&amp;C, recovery systems, and hardware integration in a rapid development project.</p> </p>",
  //   },
  // ];

  // for (let i = 0; i < projects.length; i += 1) {
  //   projectSlides.push(
  //     <SwiperSlide key={`slide-${i}`} tag="li">
  //       <figure>
  //         <img
  //           src={projects[i].imageUrl}
  //           style={{ listStyle: "none" }}
  //           alt={`Slide ${i}`}
  //         />
  //         <figcaption>{projects[i].title}</figcaption>
  //       </figure>
  //     </SwiperSlide>
  //   );
  // }

  // const slides2 = [];
  // for (let i = 0; i < dataNASA.length; i += 1) {

  // definition
  // slides2.push(
  //   <SwiperSlide key={`slide-${0}`} tag="li">
  //     <div>
  //       <div>{projects[0].definition}</div>
  //     </div>
  //   </SwiperSlide>
  // );
  // // example technologies
  // slides2.push(
  //   <SwiperSlide key={`slide-${0}`} tag="li">
  //     <div>
  //       <div>{projects[0].exampleTechnologies}</div>
  //     </div>
  //   </SwiperSlide>
  // );

  // // benefits
  // slides2.push(
  //   <SwiperSlide key={`slide-${0}`} tag="li">
  //     <div>
  //       <div>{dataNASA[0].benefits}</div>
  //     </div>
  //   </SwiperSlide>
  // );
  // }

  // TWO ways of doing this
  // 1.  Set up slides before hand aka I know what my 7 projects are, therefore all my slides are a multi dimensional array.  when you swipe, it's picking the 3rd, 4th etc already set up set of slides
  // 2. I dont know what the next project is, so I set up the slides FRESH based on the project ID.  But that a) could work badly

  // TODO: You need do multi-dimensional array.  when the user changes the

  return (
    <React.Fragment>
      {/* <Swiper
        id="main"
        controller={{ control: controlledSwiper }}
        tag="section"
        wrapperTag="ul"
        navigation
        pagination
        spaceBetween={0}
        slidesPerView={1}
        onInit={(swiper) => console.log("Swiper initialized!", swiper)}
        onSlideChange={(swiper) => {
          console.log("Slide index changed to: ", swiper.activeIndex);
        }}
        onReachEnd={() => console.log("Swiper end reached")}
      >
        {slides}
      </Swiper> */}

      <Swiper
        id="cube"
        effect={"cube"}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        controller={{ control: controlledSwiper }}
        tag="section"
        wrapperTag="ul"
        navigation
        pagination
        spaceBetween={0}
        slidesPerView={1}
        onInit={(swiper) => console.log("Swiper initialized!", swiper)}
        onSlideChange={(swiper) => {
          console.log("Slide index changed to: ", swiper.activeIndex);
          setSwiperActiveIndex(swiper.activeIndex);

          var projectDetailSlides = [];
          projectDetailSlides.push(
            <SwiperSlide key={`slideDef-${swiperActiveIndex}`} tag="li">
              <div>
                <div>{projects[swiperActiveIndex].definition}</div>
              </div>
            </SwiperSlide>
          );
          projectDetailSlides.push(
            <SwiperSlide key={`slideTech-${swiperActiveIndex}`} tag="li">
              <div>
                <div>{projects[swiperActiveIndex].exampleTechnologies}</div>
              </div>
            </SwiperSlide>
          );
          projectDetailSlides.push(
            <SwiperSlide key={`slideBene-${swiperActiveIndex}`} tag="li">
              <div>
                <div>{projects[swiperActiveIndex].benefits}</div>
              </div>
            </SwiperSlide>
          );

          // Bonus images round, if there's more than 1 image available
          if (projects[swiperActiveIndex].allImages.length > 1) {
            for (let imageItem of projects[swiperActiveIndex].allImages) {
              if (
                projects[swiperActiveIndex].primaryImageUrl !==
                imageItem.imageUrl
              ) {
                console.log("imageItem.imageUrl:" + imageItem.imageUrl);
                projectDetailSlides.push(
                  <SwiperSlide key={`slideImg-${imageItem.imageUrl}`} tag="li">
                    <div>
                      <img
                        style={{ height: "300px", width: "300px" }}
                        src={imageItem.imageUrl}
                        alt={imageItem.imageUrl}
                      />
                    </div>
                  </SwiperSlide>
                );
              } // end if url matches
            } // end for
          } // end if images length

          setDetailSlides(projectDetailSlides);
        }}
        onReachEnd={() => console.log("Swiper end reached")}
      >
        {projectSlides.map((projectSlide) => (
          <div>{projectSlide}</div>
        ))}
        {/* {{ projectSlides }} */}
        {/* <SwiperSlide
          style={{ backgroundPosition: "center", backgroundSize: "cover" }}
        >
          <div style={{ position: "relative" }}>
            <img
              style={{ height: "300px", width: "300px" }}
              src="https://techport.nasa.gov/file/2472"
              alt="img1"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide
          style={{ backgroundPosition: "center", backgroundSize: "cover" }}
        >
          <img
            style={{ height: "300px", width: "300px" }}
            src="https://techport.nasa.gov/file/5012"
            alt="img2"
          />
        </SwiperSlide>
        <SwiperSlide
          style={{ backgroundPosition: "center", backgroundSize: "cover" }}
        >
          <img
            style={{ height: "300px", width: "300px" }}
            src="https://techport.nasa.gov/file/2306"
            alt="img3"
          />
        </SwiperSlide> */}
      </Swiper>

      {/* <Swiper
        id="controller"
        onSwiper={setControlledSwiper}
        navigation
        pagination
      >
        {slides2}
      </Swiper> */}

      <Swiper
        id="controller"
        // onSwiper={setControlledSwiper}
        navigation
        pagination
      >
        {/* <SwiperSlide key={`slideDef-${swiperActiveIndex}`} tag="li">
          <div>
            <div>{projects[swiperActiveIndex].definition}</div>
          </div>
        </SwiperSlide>
        <SwiperSlide key={`slideTech-${swiperActiveIndex}`} tag="li">
          <div>
            <div>{projects[swiperActiveIndex].exampleTechnologies}</div>
          </div>
        </SwiperSlide>
        <SwiperSlide key={`slideBene-${swiperActiveIndex}`} tag="li">
          <div>
            <div>{projects[swiperActiveIndex].benefits}</div>
          </div>
        </SwiperSlide> */}
        {detailSlides.map((detailSlide) => (
          <div>{detailSlide}</div>
        ))}
        {/* {{ detailSlides }} */}
      </Swiper>
    </React.Fragment>
  );
}

export default App;
