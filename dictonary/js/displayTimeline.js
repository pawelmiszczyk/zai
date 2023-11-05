// Deklaracja obiektu przechowującego dymki do wydruku
var tooltipsForPrint = [];

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

// Funkcja do pobierania kategorii za pomocą AJAX
function getCategories(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../php/getCategories.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var categoriesData = JSON.parse(xhr.responseText);
            callback(categoriesData);
        }
    };
    xhr.send();
}

// Funkcja do wyświetlania wydarzeń na osi czasu
function displayEventsOnTimeline(eventsData, selectedCategory) {
    // Usuń poprzednią oś czasu
    d3.select("svg").remove();

    // Ustawienia oś czasu
    var timelineWidth = 100; // Szerokość osi czasu
    var timelineHeight = 600; // Wysokość osi czasu
    var lineHeight = 30; // Zwiększ grubość linii czasu
    var xPosition = 50; // Stała pozycja x dla linii czasu

    // Tworzenie skali czasu
    var parseTime = d3.timeParse("%Y-%m-%d");

    var minDate = d3.min(eventsData, function (d) { return parseTime(d.start_date); });
    var maxDate = d3.max(eventsData, function (d) { return parseTime(d.end_date); });
    minDate.setDate(minDate.getDate());
    maxDate.setDate(maxDate.getDate() + 1);

    var yScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, timelineHeight]);

    // Tworzenie oś czasu
    var svg = d3.select("#timeline")
        .append("svg")
        .attr("width", timelineWidth)
        .attr("height", timelineHeight);
		
    // Dodaj linię osi czasu
    svg.append("line")
        .attr("class", "timeline")
        .attr("x1", xPosition)
        .attr("y1", 0)
        .attr("x2", xPosition)
        .attr("y2", timelineHeight)
        .style("stroke", "black")
        .style("stroke-width", 2);

    var tooltip = d3.select(".event-tooltip");

	tooltipsForPrint = [];
    // Filtrowanie wydarzeń na podstawie wybranej kategorii
    var filteredEvents = eventsData;
    if (selectedCategory !== "all") {
        filteredEvents = eventsData.filter(function (event) {
            return event.category_id == selectedCategory;
        });
    }

    // Grupowanie wydarzeń w ramach grup czasowych
    var groups = svg.selectAll(".event-group")
        .data(filteredEvents)
        .enter()
        .append("g")
        .attr("class", "event-group");

    groups.append("rect")
        .attr("class", "event-line")
        .attr("x", xPosition - lineHeight / 2)
        .attr("y", function (d) { return yScale(parseTime(d.start_date)); })
        .attr("width", lineHeight)
        .attr("height", function (d) {
            var startDate = parseTime(d.start_date);
            var endDate = parseTime(d.end_date);
            startDate.setDate(startDate.getDate());
            endDate.setDate(endDate.getDate() + 1); // Dodajemy jeden dzień
            return yScale(endDate) - yScale(startDate);
        })
        .style("stroke", function (d) {
            if (d.category_color !== undefined && d.category_color !== null) {
                return d.category_color.toString();
            } else {
                return "steelblue";
            }
        })
        .style("fill", function (d) {
            if (d.category_color !== undefined && d.category_color !== null) {
                return d.category_color.toString();
            } else {
                return "steelblue";
            }
        });

	groups.on("mouseover", function (d) {
		var group = d3.select(this);
		var tooltip = d3.select(".event-tooltip");

		// Wyświetlanie dymka po najechaniu na linię czasu
		tooltip.html("<strong>Nazwa wydarzenia:</strong> " + d.event_name + "<br><strong>Data rozpoczęcia:</strong> " + d.start_date + "<br><strong>Data zakończenia:</strong> " + d.end_date + "<br><strong>Opis:</strong> " + d.description);

		// Dodaj obrazek do dymka, jeśli jest dostępny
		if (d.image_url) {
			tooltip.append("img")
				.attr("src", "data:image/jpeg;base64," + d.image_url)
				.attr("width", 600)
				.style("display", "block");
		}

		var tooltipWidth = tooltip.node().getBoundingClientRect().width;
		var tooltipHeight = tooltip.node().getBoundingClientRect().height;
		var pageX = d3.event.pageX;
		var pageY = d3.event.pageY;

		// Sprawdź, czy dymek wykracza poza prawy kraniec ekranu
		if (pageX + tooltipWidth > window.innerWidth) {
			pageX = window.innerWidth - tooltipWidth;
		}

		// Sprawdź, czy dymek wykracza poza dolny kraniec ekranu
		if (pageY + tooltipHeight > window.innerHeight) {
			pageY = window.innerHeight - tooltipHeight;
		} else if (pageY < 0) {
			// Jeśli dymek wykracza poza górny kraniec ekranu, wyświetl go na górze
			pageY = 0;
		}

		tooltip.style("left", pageX + "px")
			.style("top", pageY + "px")
			.style("display", "block");
	});


    groups.on("mouseout", function (d) {
        // Ukrywanie dymka po zjechaniu kursorem z lini czasu
        var tooltip = d3.select(".event-tooltip");
		// Usuń zawartość dymka przy zdarzeniu "mouseout"
		tooltip.html("");
        tooltip.style("display", "none");
    });
	

	groups.each(function (d) {
		var group = d3.select(this);
		var tooltip = document.createElement("div");
		tooltip.className = "event-tooltip";
		tooltip.innerHTML = "<strong>Nazwa wydarzenia:</strong> " + d.event_name + " <strong>Data rozpoczęcia:</strong> " + d.start_date + " <strong>Data zakończenia:</strong> " + d.end_date + "<br><strong>Opis:</strong> " + d.description + "<br>";
		
		if (d.image_url) {
			var img = document.createElement("img");
			img.src = "data:image/jpeg;base64," + d.image_url;
			img.width = 600;
			tooltip.appendChild(img);
		}
		
		tooltipsForPrint.push(tooltip);

});

}

// Pobierz kategorie i wydarzenia, a następnie wyświetl na osi czasu
getCategories(function (categoriesData) {
    // Wygeneruj opcje listy rozwijanej na podstawie kategorii
    var categorySelect = document.getElementById("categorySelect");

    categoriesData.forEach(function (category) {
        var option = document.createElement("option");
        option.value = category.category_id;
        option.text = category.category_name;
        categorySelect.appendChild(option);
    });

    // Obsługa zmiany wybranej kategorii
    categorySelect.addEventListener("change", function () {
        var selectedCategory = categorySelect.value;
        getEventsData(function (eventsData) {
            displayEventsOnTimeline(eventsData, selectedCategory);
        });
    });

    // Pobierz początkowe wydarzenia
    getEventsData(function (eventsData) {
        displayEventsOnTimeline(eventsData, "all"); // Domyślnie "Wszystkie" kategorie
    });
});
