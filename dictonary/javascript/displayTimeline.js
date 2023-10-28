// Funkcja do pobierania danych z serwera za pomocą AJAX
function getEventsData(callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "../php/getEvents.php", true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var eventsData = JSON.parse(xhr.responseText);
			callback(eventsData);
		}
	};
	xhr.send();
}

// Funkcja do wyświetlania wydarzeń na osi czasu
function displayEventsOnTimeline(eventsData) {
	// Ustawienia oś czasu
	var timelineWidth = 800;
	var timelineHeight = 50;

	// Tworzenie skali czasu
	var parseTime = d3.timeParse("%Y-%m-%d");

	var xScale = d3.scaleTime()
		.domain([
			d3.min(eventsData, function (d) { return parseTime(d.start_date); }),
			d3.max(eventsData, function (d) { return parseTime(d.end_date); })
		])
		.range([0, timelineWidth]);

	// Tworzenie oś czasu
	var svg = d3.select("#timeline")
		.append("svg")
		.attr("width", timelineWidth)
		.attr("height", timelineHeight);

	// Dodawanie linii łączącej wydarzenia
	var line = d3.line()
		.x(function (d) { return xScale(parseTime(d.start_date)); })
		.y(25);

	svg.append("path")
		.datum(eventsData)
		.attr("class", "event-line")
		.attr("d", line)
		.style("stroke", "steelblue")
		.style("fill", "none");

	var tooltip = d3.select(".event-tooltip");

	// Dodawanie punktów na osi czasu
	svg.selectAll(".event-circle")
		.data(eventsData)
		.enter()
		.append("circle")
		.attr("class", "event-circle")
		.attr("cx", function (d) { return xScale(parseTime(d.start_date)); })
		.attr("cy", 25)
		.attr("r", 10)  // Rozmiar punktu
		.style("fill", function (d) { return d.category_color; })  // Kolor punktu
		.on("mouseover", function (d) {
			// Wyświetlanie dymka po najechaniu kursorem na punkt
			tooltip.html("<strong>Nazwa:</strong> " + d.event_name + "<br><strong>Data rozpoczęcia:</strong> " + d.start_date + "<br><strong>Opis:</strong> " + d.description);

			// Dodaj obrazek do dymka
			if (d.image_url) {
				tooltip.append("img")
					.attr("src", "data:image/jpeg;base64," + d.image_url)
					.attr("width", 600) // Dostosuj szerokość obrazu
					.style("display", "block");
			}

			tooltip.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px")
				.style("display", "block");
		})
		.on("mouseout", function (d) {
			// Ukrywanie dymka po zjechaniu kursorem z punktu
			tooltip.style("display", "none");
		});

	// Suwak do skalowania osi czasu
	var timeRange = document.getElementById("timeRange");
	timeRange.addEventListener("input", function () {
		var scaleValue = parseFloat(this.value) / 100;
		var newRange = timelineWidth * scaleValue;
		xScale.range([0, newRange]);
		svg.selectAll(".event-circle")
			.attr("cx", function (d) { return xScale(parseTime(d.start_date)); });
	});
}

// Pobierz dane wydarzeń i wyświetl na oś czasu
getEventsData(displayEventsOnTimeline);