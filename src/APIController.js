const APIController = (function () {
  const apiUrl = "https://api.nasa.gov/techport/api";
  const nasaFileUrl = "https://techport.nasa.gov/file/";

  var _searchForProjects = async (token, searchTerms) => {
    console.log("APIC, searchTerms :" + searchTerms);
    console.log("APIC, token :" + token);
    console.log("APIC, apiUrl :" + apiUrl);
    console.time("projectIdQuery");
    const queryProjects =
      apiUrl +
      "/projects/search?searchQuery=" +
      encodeURIComponent(searchTerms) +
      "&api_key=" +
      token;
    console.log("APIC, queryProjects :" + queryProjects);

    // get Projects
    const projectResult = await fetch(queryProjects, {
      method: "GET",
      headers: {},
    });
    let projectIdArray = [];

    const projectDataJson = await projectResult.json();
    console.log("APIC, projectDataJson :" + JSON.stringify(projectDataJson));
    projectDataJson.projects.forEach((projectEl) => {
      projectIdArray.push(projectEl.projectId);
    });
    console.log("APIC, projectIdArray :" + JSON.stringify(projectIdArray));
    console.timeEnd("projectIdQuery");
    if (projectIdArray.length > 40) {
      console.log(
        `TOO MANY PROJECT IDS RETURNED(${projectIdArray.length}) - SEARCH IS TOO BROAD`
      );
      return [];
    }
    let projectsArray = [];
    // get the project images etc
    console.time("projectsQuery");
    await Promise.all(
      projectIdArray.map(async (projectId) => {
        let projectsUrl = `${apiUrl}/projects/${projectId}?api_key=${token}`;
        console.log("projectsUrl:" + projectsUrl);

        let projectResult = await fetch(projectsUrl, {
          method: "GET",
          headers: {},
        });
        var jsonDetail = projectResult.json();
        return jsonDetail;
      })
    ).then((projectDetails) => {
      console.timeEnd("projectsQuery");
      console.time("projectsSorting");
      console.log(
        "projectDetails(beforeSorting):" + JSON.stringify(projectDetails)
      );

      projectDetails.forEach((projectDetail) => {
        // iterate around "library items"
        let imageUrl = "";
        let file = "";
        let imageDescription = "";
        let imageTitle = "";
        let hasImages = false;
        let allImages = [];
        let primaryImageUrl = "";
        let hasTaxonomy = false;
        let benefits = "";
        let definition = "";
        let exampleTechnologies = "";
        const hardcodedLimit = 15; // to avoid re-implementing paging twice (maybe)
        let usableProjectsCounter = 0; // to avoid re-implementing paging twice (maybe)

        console.log("projectDetail:" + JSON.stringify(projectDetail));

        if (projectDetail.project.primaryImage !== undefined) {
          primaryImageUrl =
            nasaFileUrl + projectDetail.project.primaryImage.file.fileId;
        }

        if (projectDetail.project.benefits !== undefined) {
          benefits = projectDetail.project.benefits;
        }

        if (primaryImageUrl !== "") {
          // hello, eye candy only: no eggheads allowed

          // TODO: I'm tempted to ditch anything without taxonomy as well
          console.log(
            "projectDetail.project.primaryTaxonomyNodes.length:" +
              projectDetail.project.primaryTaxonomyNodes.length
          );
          if (projectDetail.project.primaryTaxonomyNodes.length) {
            definition =
              projectDetail.project.primaryTaxonomyNodes[0].definition;
            exampleTechnologies =
              projectDetail.project.primaryTaxonomyNodes[0].exampleTechnologies;
            hasTaxonomy = true;
          }

          // TODO this becomes EXTRA image retrieval, therefore moves below, becomes an array etc...
          if (projectDetail.project.libraryItems.length > 0) {
            for (let libItem of projectDetail.project.libraryItems) {
              console.log("libItem:" + JSON.stringify(libItem));

              if (libItem.contentType.code === "IMAGE") {
                hasImages = true;
                // Pete todo: Externalise the NASA file URL (although it's not likely to change)
                // Note you'd think it would be using the filename, extension etc, but it's actually retrieved by the file ID.  And they removed the previous URL and haven't updated their documentation!
                allImages.push({
                  imageUrl: nasaFileUrl + libItem.file.fileId,
                  imageTitle: libItem.title, // could be anything, not just jpg name
                  imageDescription: libItem.description,
                });
                // break;
              }
            } // end for libItems
          } // end if length

          usableProjectsCounter++;
          if (usableProjectsCounter <= hardcodedLimit) {
            var project = {
              id: projectDetail.project.projectId,
              title: projectDetail.project.title,
              startDate: projectDetail.project.startDateString,
              endDate: projectDetail.project.endDateString,
              status: projectDetail.project.statusDescription,
              website: projectDetail.project.website,
              allImages: allImages,
              primaryImageUrl: primaryImageUrl,
              // imageDescription: imageDescription,
              // imageTitle: imageTitle,
              definition: definition,
              exampleTechnologies: exampleTechnologies,
              benefits: benefits,
              hasTaxonomy: hasTaxonomy,
              hasImages: hasImages,
            };
            console.log("allImages:" + JSON.stringify(allImages));
            console.log("primaryImageUrl:" + JSON.stringify(primaryImageUrl));
            console.log("project:" + JSON.stringify(project));

            projectsArray.push(project);
          } // end limit
        } // end hasImages
      }); // end project detail
    }); // end projectDetails array
    console.timeEnd("projectsSorting");
    return projectsArray;
  };

  const _getProjectDetails = async (token, projectEndPoint, projectArray) => {
    const result = await fetch(`${projectEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    // for each track in release, add to project array
    await data.projects.items.forEach((projectEl) => {
      projectArray.push(projectEl);
    });

    console.log("_getProject:data:" + JSON.stringify(data));
    console.log("_getProject:trackArray:" + JSON.stringify(projectArray));
    return projectArray;
  };

  const _getToken = async () => {
    //todo: don't have this in the code obviously, maybe in a file or dynamic?
    return "dO88of9b8oCDxO8PNkxPjjyOCEHo838GbcPNgBle";
  };

  return {
    getToken() {
      return _getToken();
    },
    async searchForProjects(token, searchTerms) {
      return _searchForProjects(token, searchTerms);
    },
    getProjectDetails(token, projectEndPoint) {
      return _getProjectDetails(token, projectEndPoint);
    },
  };
})();

export default APIController;
