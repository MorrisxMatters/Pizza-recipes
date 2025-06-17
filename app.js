class PizzaCalculator {
    constructor() {
        this.elements = {
            people: document.getElementById('people'),
            hydration: document.getElementById('hydration'),
            hydrationValue: document.getElementById('hydrationValue'),
            hours: document.getElementById('hours'),
            decreasePeople: document.getElementById('decreasePeople'),
            increasePeople: document.getElementById('increasePeople'),
            flourAmount: document.getElementById('flourAmount'),
            waterAmount: document.getElementById('waterAmount'),
            waterPercent: document.getElementById('waterPercent'),
            yeastAmount: document.getElementById('yeastAmount'),
            yeastPercent: document.getElementById('yeastPercent'),
            maltAmount: document.getElementById('maltAmount'),
            maltPercent: document.getElementById('maltPercent'),
            saltAmount: document.getElementById('saltAmount'),
            saltPercent: document.getElementById('saltPercent'),
            totalWeight: document.getElementById('totalWeight')
        };
        
        this.formulas = {
            flourPerPerson: 140,
            yeastCalculation: (hours, people) => (hours / 64) * people,
            waterCalculation: (hydrationPercent, flourWeight) => (hydrationPercent / 100) * flourWeight,
            maltCalculation: (yeastWeight) => 2 * yeastWeight,
            saltCalculation: (maltWeight) => maltWeight
        };
        
        this.limits = {
            people: { min: 1, max: 20 },
            hydration: { min: 50, max: 80 },
            hours: { min: 1, max: 72 }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.calculate();
    }
    
    bindEvents() {
        // People counter buttons
        this.elements.decreasePeople.addEventListener('click', () => {
            const current = parseInt(this.elements.people.value);
            if (current > this.limits.people.min) {
                this.elements.people.value = current - 1;
                this.calculate();
            }
        });
        
        this.elements.increasePeople.addEventListener('click', () => {
            const current = parseInt(this.elements.people.value);
            if (current < this.limits.people.max) {
                this.elements.people.value = current + 1;
                this.calculate();
            }
        });
        
        // Hydration slider
        this.elements.hydration.addEventListener('input', (e) => {
            this.elements.hydrationValue.textContent = e.target.value;
            this.calculate();
        });
        
        // Hours input
        this.elements.hours.addEventListener('input', () => {
            this.validateHours();
            this.calculate();
        });
        
        // People input direct change (in case user types directly)
        this.elements.people.addEventListener('input', () => {
            this.validatePeople();
            this.calculate();
        });
    }
    
    validatePeople() {
        const value = parseInt(this.elements.people.value);
        if (isNaN(value) || value < this.limits.people.min) {
            this.elements.people.value = this.limits.people.min;
        } else if (value > this.limits.people.max) {
            this.elements.people.value = this.limits.people.max;
        }
    }
    
    validateHours() {
        const value = parseFloat(this.elements.hours.value);
        if (isNaN(value) || value < this.limits.hours.min) {
            this.elements.hours.value = this.limits.hours.min;
        } else if (value > this.limits.hours.max) {
            this.elements.hours.value = this.limits.hours.max;
        }
    }
    
    calculate() {
        // Get input values
        const people = parseInt(this.elements.people.value) || 2;
        const hydrationPercent = parseInt(this.elements.hydration.value) || 60;
        const hours = parseFloat(this.elements.hours.value) || 24;
        
        // Calculate ingredients
        const flourWeight = this.formulas.flourPerPerson * people;
        const yeastWeight = this.formulas.yeastCalculation(hours, people);
        const waterWeight = this.formulas.waterCalculation(hydrationPercent, flourWeight);
        const maltWeight = this.formulas.maltCalculation(yeastWeight);
        const saltWeight = this.formulas.saltCalculation(maltWeight);
        
        // Calculate total weight
        const totalWeight = flourWeight + waterWeight + yeastWeight + maltWeight + saltWeight;
        
        // Calculate percentages (baker's percentages - relative to flour)
        const waterPercent = (waterWeight / flourWeight) * 100;
        const yeastPercent = (yeastWeight / flourWeight) * 100;
        const maltPercent = (maltWeight / flourWeight) * 100;
        const saltPercent = (saltWeight / flourWeight) * 100;
        
        // Update display
        this.updateDisplay({
            flour: flourWeight,
            water: waterWeight,
            waterPercent: waterPercent,
            yeast: yeastWeight,
            yeastPercent: yeastPercent,
            malt: maltWeight,
            maltPercent: maltPercent,
            salt: saltWeight,
            saltPercent: saltPercent,
            total: totalWeight
        });
    }
    
    updateDisplay(ingredients) {
        // Format numbers appropriately
        this.elements.flourAmount.textContent = this.formatWeight(ingredients.flour, 1);
        this.elements.waterAmount.textContent = this.formatWeight(ingredients.water, 1);
        this.elements.waterPercent.textContent = this.formatPercent(ingredients.waterPercent);
        this.elements.yeastAmount.textContent = this.formatWeight(ingredients.yeast, 2);
        this.elements.yeastPercent.textContent = this.formatPercent(ingredients.yeastPercent);
        this.elements.maltAmount.textContent = this.formatWeight(ingredients.malt, 2);
        this.elements.maltPercent.textContent = this.formatPercent(ingredients.maltPercent);
        this.elements.saltAmount.textContent = this.formatWeight(ingredients.salt, 2);
        this.elements.saltPercent.textContent = this.formatPercent(ingredients.saltPercent);
        this.elements.totalWeight.textContent = this.formatWeight(ingredients.total, 1);
    }
    
    formatWeight(weight, decimals = 1) {
        return weight.toFixed(decimals);
    }
    
    formatPercent(percent, decimals = 1) {
        return percent.toFixed(decimals) + '%';
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PizzaCalculator();
});

// Add some helpful tooltips and accessibility features
document.addEventListener('DOMContentLoaded', () => {
    // Add tooltips for ingredients (simple title attributes)
    const tooltips = {
        flour: "Base dell'impasto, 140g per persona secondo la tradizione",
        water: "Idratazione variabile dal 50% all'80% del peso della farina",
        yeast: "Lievito di birra fresco, calcolato in base alle ore di lievitazione",
        malt: "Malto diastasico per favorire la lievitazione e doratura",
        salt: "Sale fino da cucina, uguale al peso del malto"
    };
    
    // Add smooth transitions for value changes
    const animateValue = (element, newValue, duration = 300) => {
        const startValue = parseFloat(element.textContent) || 0;
        const endValue = parseFloat(newValue);
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = startValue + (endValue - startValue) * progress;
            element.textContent = newValue; // Keep original formatting
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    };
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeElement = document.activeElement;
        
        if (activeElement.id === 'people') {
            if (e.key === 'ArrowUp' || e.key === '+') {
                e.preventDefault();
                document.getElementById('increasePeople').click();
            } else if (e.key === 'ArrowDown' || e.key === '-') {
                e.preventDefault();
                document.getElementById('decreasePeople').click();
            }
        }
        
        if (activeElement.id === 'hydration') {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                // Let the browser handle slider navigation
                setTimeout(() => {
                    document.getElementById('hydrationValue').textContent = activeElement.value;
                }, 0);
            }
        }
    });
    
    // Add visual feedback for button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
});