class Farmer:
    def _init_(self, farmerId: int, name: str, contactInfo: str, experience: int):
        self.farmerId = farmerId
        self.name = name
        self.contactInfo = contactInfo
        self.experience = experience

    def registerField(self, crop):
        print(f"{self.name} registered field ID {crop.fieldId}.")


class Crop:
    def _init_(self, fieldId: int, location: str, size: float):
        self.fieldId = fieldId
        self.location = location
        self.size = size

    def associateCrop(self, soil):
        print(f"Crop at field {self.fieldId} is associated with soil ID {soil.soilId}.")


class Soil:
    def _init_(self, soilId: int, pH: float, moisture: float, level: str):
        self.soilId = soilId
        self.pH = pH
        self.moisture = moisture
        self.level = level

    def scheduleIrrigation(self, irrigation):
        print(f"Soil ID {self.soilId} scheduled for irrigation type {irrigation.type}.")


class Soil1(Soil):
    def _init_(self, soilId: int, pH: float, moistureLevel: float, nutrientContent: str):
        super()._init_(soilId, pH, moistureLevel, level="N/A")
        self.moistureLevel = moistureLevel
        self.nutrientContent = nutrientContent

    def analyzeSoil(self):
        print(f"Analyzing Soil ID {self.soilId} with nutrient content: {self.nutrientContent}.")


class Irrigation:
    def _init_(self, irrigationId: int, type: str, schedule: str):
        self.irrigationId = irrigationId
        self.type = type
        self.schedule = schedule

    def setWaterUsage(self, usage: float):
        print(f"Set water usage for irrigation ID {self.irrigationId} to {usage} liters.")


class Irrigation1(Irrigation):
    def _init_(self, irrigationId: int, type: str, schedule: str):
        super()._init_(irrigationId, type, schedule)