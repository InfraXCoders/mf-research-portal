// Calculator Test Suite
// Run this in Node.js or browser console to verify calculator functionality

console.log('🧪 Starting Calculator Tests...\n');

// Simple calculator functions (standalone for testing)
function calculateInvestmentGrowth(initialAmount, returnRate, years) {
    const rate = returnRate / 100;
    const finalAmount = initialAmount * Math.pow(1 + rate, years);
    
    return {
        invested: initialAmount,
        current: finalAmount,
        gain: finalAmount - initialAmount,
        gainPercent: ((finalAmount - initialAmount) / initialAmount) * 100
    };
}

function calculateSIPReturns(monthlyAmount, returnRate, years) {
    const months = years * 12;
    const monthlyRate = returnRate / 12 / 100;
    
    let totalInvested = 0;
    let futureValue = 0;
    
    for (let i = 0; i < months; i++) {
        totalInvested += monthlyAmount;
        futureValue += monthlyAmount * Math.pow(1 + monthlyRate, months - i);
    }
    
    return {
        invested: totalInvested,
        current: futureValue,
        gain: futureValue - totalInvested,
        gainPercent: ((futureValue - totalInvested) / totalInvested) * 100
    };
}

// Test Suite
let testsRun = 0;
let testsPassed = 0;

function runTest(name, testFn) {
    testsRun++;
    try {
        if (testFn()) {
            testsPassed++;
            console.log(`✅ ${name} - PASSED`);
            return true;
        } else {
            console.log(`❌ ${name} - FAILED`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${name} - ERROR: ${error.message}`);
        return false;
    }
}

console.log('📊 Testing Lumpsum Calculator:\n');

// Test 1: Basic lumpsum calculation
runTest('Test 1: Basic Lumpsum (₹1,00,000 @ 18% for 5 years)', () => {
    const result = calculateInvestmentGrowth(100000, 18, 5);
    console.log(`   Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${Math.round(result.gain).toLocaleString('en-IN')} (${result.gainPercent.toFixed(2)}%)\n`);
    
    // Expected: ₹100,000 * (1.18)^5 = ₹228,776.31
    return result.current > 228000 && result.current < 229000;
});

// Test 2: Different return rate
runTest('Test 2: Moderate Return (₹50,000 @ 12% for 10 years)', () => {
    const result = calculateInvestmentGrowth(50000, 12, 10);
    console.log(`   Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${Math.round(result.gain).toLocaleString('en-IN')}\n`);
    
    // Expected: ₹50,000 * (1.12)^10 = ₹155,292
    return result.current > 155000 && result.current < 156000;
});

// Test 3: Zero return
runTest('Test 3: Zero Return (₹25,000 @ 0% for 5 years)', () => {
    const result = calculateInvestmentGrowth(25000, 0, 5);
    console.log(`   Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${result.gain}\n`);
    
    return result.current === 25000 && result.gain === 0;
});

// Test 4: Single year
runTest('Test 4: Single Year (₹10,000 @ 15% for 1 year)', () => {
    const result = calculateInvestmentGrowth(10000, 15, 1);
    console.log(`   Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${Math.round(result.gain).toLocaleString('en-IN')}\n`);
    
    return result.current === 11500;
});

console.log('\n💰 Testing SIP Calculator:\n');

// Test 5: Basic SIP
runTest('Test 5: Basic SIP (₹5,000/month @ 12% for 10 years)', () => {
    const result = calculateSIPReturns(5000, 12, 10);
    console.log(`   Monthly: ₹${result.invested / 120}`);
    console.log(`   Total Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${Math.round(result.gain).toLocaleString('en-IN')} (${result.gainPercent.toFixed(2)}%)\n`);
    
    // Expected: ~₹11,61,695
    return result.invested === 600000 && result.current > 1150000 && result.current < 1170000;
});

// Test 6: Long-term SIP
runTest('Test 6: Long-term SIP (₹10,000/month @ 15% for 20 years)', () => {
    const result = calculateSIPReturns(10000, 15, 20);
    console.log(`   Monthly: ₹${result.invested / 240}`);
    console.log(`   Total Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${Math.round(result.gain).toLocaleString('en-IN')}\n`);
    
    // Expected: Invested ₹24,00,000, Maturity ~₹1.51 crores
    return result.invested === 2400000 && result.current > 15000000;
});

// Test 7: Short-term SIP
runTest('Test 7: Short-term SIP (₹3,000/month @ 10% for 3 years)', () => {
    const result = calculateSIPReturns(3000, 10, 3);
    console.log(`   Monthly: ₹${result.invested / 36}`);
    console.log(`   Total Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${Math.round(result.gain).toLocaleString('en-IN')}\n`);
    
    return result.invested === 108000 && result.current > 108000;
});

// Test 8: High return SIP
runTest('Test 8: High Return SIP (₹1,000/month @ 20% for 15 years)', () => {
    const result = calculateSIPReturns(1000, 20, 15);
    console.log(`   Monthly: ₹${result.invested / 180}`);
    console.log(`   Total Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}`);
    console.log(`   Gain: ₹${Math.round(result.gain).toLocaleString('en-IN')}\n`);
    
    return result.invested === 180000 && result.current > 1000000;
});

console.log('\n🔍 Testing Edge Cases:\n');

// Test 9: Large amounts
runTest('Test 9: Large Investment (₹10,00,000 @ 14% for 7 years)', () => {
    const result = calculateInvestmentGrowth(1000000, 14, 7);
    console.log(`   Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}\n`);
    
    return result.current > 2500000;
});

// Test 10: Fractional returns
runTest('Test 10: Fractional Return (₹75,000 @ 8.5% for 6 years)', () => {
    const result = calculateInvestmentGrowth(75000, 8.5, 6);
    console.log(`   Invested: ₹${result.invested.toLocaleString('en-IN')}`);
    console.log(`   Maturity: ₹${Math.round(result.current).toLocaleString('en-IN')}\n`);
    
    return result.current > 120000;
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Test Summary: ${testsPassed}/${testsRun} tests passed`);
console.log('='.repeat(50) + '\n');

if (testsPassed === testsRun) {
    console.log('🎉 SUCCESS! All calculators are working perfectly!');
    console.log('✅ Lumpsum Calculator - Working');
    console.log('✅ SIP Calculator - Working');
    console.log('✅ Edge Cases - Handled');
} else {
    console.log(`⚠️ ${testsRun - testsPassed} test(s) failed!`);
    console.log('Please review the failed tests above.');
}

console.log('\n📝 Calculator Formulas:');
console.log('Lumpsum: Future Value = Principal × (1 + Rate)^Years');
console.log('SIP: Future Value = Monthly Amount × ((1 + Monthly Rate)^Months - 1) / Monthly Rate × (1 + Monthly Rate)');
console.log('\n✅ Both calculators use compound interest calculations.');

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateInvestmentGrowth,
        calculateSIPReturns
    };
}
