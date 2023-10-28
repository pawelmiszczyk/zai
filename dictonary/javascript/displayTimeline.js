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
	var timelineWidth = 1200;
	var timelineHeight = 100;

	// Tworzenie skali czasu
	var parseTime = d3.timeParse("%Y-%m-%d");

	var minDate = d3.min(eventsData, function (d) { return parseTime(d.start_date); });
	var maxDate = d3.max(eventsData, function (d) { return parseTime(d.end_date); });
	var sumOfDates = minDate.getDate() + maxDate.getDate();
	minDate.setDate(minDate.getDate() - sumOfDates/20);
	maxDate.setDate(maxDate.getDate() + sumOfDates/20);

	var xScale = d3.scaleTime()
		.domain([
			minDate,
			maxDate
		])
		.range([sumOfDates/20, timelineWidth - sumOfDates/20]);

	// Tworzenie oś czasu
	var svg = d3.select("#timeline")
		.append("svg")
		.attr("width", timelineWidth)
		.attr("height", timelineHeight);

	// Dodawanie linii łączącej wydarzenia
	var line = d3.line()
		.x(function (d) { return xScale(parseTime(d.start_date)); })
		.y(50);

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
		.attr("cy", 50)
		.attr("r", 15)  // Rozmiar punktu
		.style("fill", function (d) { return d.category_color; })  // Kolor punktu
		.on("mouseover", function (d) {
			var tooltip = d3.select(".event-tooltip");

			// Wyświetlanie dymka po najechaniu kursorem na punkt
			tooltip.html("<strong>Nazwa:</strong> " + d.event_name + "<br><strong>Data rozpoczęcia:</strong> " + d.start_date + "<br><strong>Opis:</strong> " + d.description);

			// Dodaj obrazek do dymka
			if (d.image_url) {
				tooltip.append("img")
					.attr("src", "data:image/jpeg;base64," + d.image_url)
					.attr("width", 600) // Dostosuj szerokość obrazu
					.style("display", "block");
			}

			var tooltipWidth = tooltip.node().getBoundingClientRect().width;
			var tooltipHeight = tooltip.node().getBoundingClientRect().height;
			var pageX = d3.event.pageX;
			var pageY = d3.event.pageY;

			// Sprawdź, czy dymek wykracza poza prawy lub dolny kraniec ekranu
			if (pageX + tooltipWidth > window.innerWidth) {
				pageX = window.innerWidth - tooltipWidth;
			}

			if (pageY + tooltipHeight > window.innerHeight) {
				pageY = window.innerHeight - tooltipHeight;
			}
			
			tooltip.style("left", pageX + "px")
				.style("top", pageY + "px")
				.style("display", "block");
		})
		.on("mouseout", function (d) {
			// Ukrywanie dymka po zjechaniu kursorem z punktu
			tooltip.style("display", "none");
		});

}

// Pobierz dane wydarzeń i wyświetl na oś czasu
getEventsData(displayEventsOnTimeline);