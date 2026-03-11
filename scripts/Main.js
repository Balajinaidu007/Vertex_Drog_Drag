function executeWidgetCode() {	
    require(['DS/DataDragAndDrop/DataDragAndDrop'], function(DataDragAndDrop) {
        var myWidget = {
            displayData: function(obj) {
                var contentDiv = document.getElementById("content-display");
                var dropZoneUI = document.getElementById("drop-zone-ui");
                
                // Switch visibility
                dropZoneUI.style.display = "none";
                contentDiv.style.display = "block";
                
                if(obj.data.items[0].objectType !== "VPMReference"){
                    contentDiv.innerHTML = "<h4>Not a VPMReference Product</h4><button onclick='location.reload()'>Back</button>";
                } else {
                    var tableHTML = "<button id='callApiBtn' class='btn btn-primary'>Send To Vertex</button><div id='apiResult'></div><br/>";
                    tableHTML += "<table><thead><tr><th>Type</th><th>Name</th><th>ID</th></tr></thead>";
                    tableHTML += "<tbody><tr><td>"+obj.data.items[0].objectType+"</td><td>"+obj.data.items[0].displayName+"</td><td>"+obj.data.items[0].objectId+"</td></tr></tbody></table>";
                    contentDiv.innerHTML = tableHTML;
                }

                document.getElementById("callApiBtn").onclick = function () {
                    if (confirm("Send " + obj.data.items[0].displayName + " to Vertex?")) {
                        var url = "https://www.plmtrainer.com:444/Vertex-0.0.1-SNAPSHOT/vertexvis/v1/exportdata?id=" + obj.data.items[0].objectId;
                        fetch(url, { method: "GET" })
                        .then(res => res.json())
                        .then(data => {
                            const formattedSummary = data["Summary Lines"].replace(/\n/g, "<br>");
                            document.getElementById("apiResult").innerHTML = "<div class='success-box'>" + formattedSummary + "</div>";
                        })
                        .catch(err => {
                            document.getElementById("apiResult").innerHTML = "<p style='color:red;'>Error: " + err.message + "</p>";
                        });
                    }
                };
            },

            onLoad: function() {
                myWidget.dragZone();	
            },

            dragZone: function() {
                var dropElement = widget.body;
                DataDragAndDrop.droppable(dropElement, {
                    drop: function(data){
                        var obj = JSON.parse(data);
                        myWidget.displayData(obj);
                        widget.body.classList.remove("drag-over");
                    },
                    enter: function(){ widget.body.classList.add("drag-over"); },
                    leave: function(){ widget.body.classList.remove("drag-over"); }
                });	
            }
        }; 			
        widget.addEvent('onLoad', myWidget.onLoad);
    });
}