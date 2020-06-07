
import ComplexNumber from '../complex-number/ComplexNumber';

const CLOSE_TO_ZERO_THRESHOLD = 1e-10;

/**
 * Discrete Fourier Transform (DFT): time to frequencies.
 *
 * Time complexity: O(N^2)
 *
 * @param {number[]} inputAmplitudes - Input signal amplitudes over time (complex
 * numbers with real parts only).
 * @param {number} zeroThreshold - Threshold that is used to convert real and imaginary numbers
 * to zero in case if they are smaller then this.
 *
 * @return {ComplexNumber[]} - Array of complex number. Each of the number represents the frequency
 * or signal. All signals together will form input signal over discrete time periods. Each signal's
 * complex number has radius (amplitude) and phase (angle) in polar form that describes the signal.
 *
 * @see https://gist.github.com/anonymous/129d477ddb1c8025c9ac
 * @see https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/
 */
export default function dft(inputAmplitudes, zeroThreshold = CLOSE_TO_ZERO_THRESHOLD) {
    const N = inputAmplitudes.length;
    const signals = [];

    // Go through every discrete frequency.
    for (let frequency = 0; frequency < N; frequency += 1) {
        // Compound signal at current frequency that will ultimately
        // take part in forming input amplitudes.
        let frequencySignal = new ComplexNumber();

        // Go through every discrete point in time.
        for (let timer = 0; timer < N; timer += 1) {
            const currentAmplitude = inputAmplitudes[timer];

            // Calculate rotation angle.
            const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);

            // Remember that e^ix = cos(x) + i * sin(x);
            const dataPointContribution = new ComplexNumber({
                re: Math.cos(rotationAngle),
                im: Math.sin(rotationAngle),
            }).multiply(currentAmplitude);

            // Add this data point's contribution.
            frequencySignal = frequencySignal.add(dataPointContribution);
        }

        // Close to zero? You're zero.
        if (Math.abs(frequencySignal.re) < zeroThreshold) {
            frequencySignal.re = 0;
        }

        if (Math.abs(frequencySignal.im) < zeroThreshold) {
            frequencySignal.im = 0;
        }

        // Average contribution at this frequency.
        // The 1/N factor is usually moved to the reverse transform (going from frequencies
        // back to time). This is allowed, though it would be nice to have 1/N in the forward
        // transform since it gives the actual sizes for the time spikes.
        frequencySignal = frequencySignal.divide(N);

        // Add current frequency signal to the list of compound signals.
        signals[frequency] = frequencySignal;
    }

    return signals;
}

export function myfunctionF(matrizAdya) {

    let min = -10;
    for (let i = 0; i < matrizAdya.length; i++) {
        if (min > matrizAdya[0][i]) {
            min = matrizAdya[0][i];
        }
    }
    let minValue = matrizAdya[0];
    for (let i = 1; i < matrizAdya[0].length; i++) {
        let currentValue = matrizAdya[0][i];
        if (currentValue < minValue) {
            minValue = currentValue;
        }
    }
    let maxValue = matrizAdya[0];
    for (let i = 1; i < matrizAdya[0].length; i++) {
        let currentValue = matrizAdya[0][i];
        if (currentValue > maxValue) {
            maxValue = currentValue;
        }
    }
    let data = new Array(1);
    data[0][0] = minValue;
    data[0][1] = maxValue;
    return data;
}


export function minimizacion(matrizAdya) {
    let min = [];
    // min.push(value);
    for (let j = 0; j < matrizAdya[0].length; j++) {
        let minn = matrizAdya[j][0];
        for (let i = 0; i < matrizAdya.length; i++) {
            if (minn > matrizAdya[i][j])
                minn = matrizAdya[i][j];
        }
        min.push(minn);
    }

    for (let j = 0; j < matrizAdya[0].length; j++) {
        for (let i = 0; i < matrizAdya.length; i++) {
            matrizAdya[i][j] = matrizAdya[i][j] - min[j];
        }
    }
    let min1 = [];
    for (let i = 0; i < matrizAdya.length; i++) {
        let minimo = matrizAdya[i][0];
        for (let j = 0; j < matrizAdya[0].length; j++) {
            if (minimo > matrizAdya[i][j])
                minimo = matrizAdya[i][j];
        }
        min1.push(minimo);
    }
    // console.table(min1);
    for (let i = 0; i < matrizAdya.length; i++) {
        for (let j = 0; j < matrizAdya[0].length; j++) {
            matrizAdya[i][j] = matrizAdya[i][j] - min1[i];
        }
    }
    return matrizAdya;
}
// let items = [
//   [1, 2, 4],
//   [3, 5, 7],
//   [9, 2, 6]
// ];

// console.table(minimizacion(items));
export function selectionSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let min = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[min] > arr[j]) {
                min = j;
            }
        }
        if (min !== i) {
            let tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
        }
    }
    return arr;
}

export function fastfourierV1(signal) {
    // var fft = require('fft-js').fft, signal = [1, 0, 1, 0];

    // var phasors = fft(signal);

    // console.log(phasors);
    // return phasors;

    // var preSignals = {
    //     'BESSEL': require('bessel'),
    //     'fft': require('fft-js').fft,
    //     'fftUtil': require('fft-js').util,
    //     'kaiserP': function (L, a, i) {
    //         var argSqrt = 1 - Math.pow((2 * i / (L - 1) - 1), 2);
    //         var radix = a * (Math.sqrt(argSqrt));
    //         //BESSEL function con ordine 0 entrambe
    //         var up = this.BESSEL.besseli(radix, 0);
    //         var down = this.BESSEL.besseli(a, 0);
    //         var result = up / down;
    //         return result;
    //     },
    //     'padding': function (arr) {
    //         var L = arr.length;
    //         var bitWise = 0;
    //         while (L != 0) {
    //             bitWise += 1;
    //             L = L >> 1;
    //         }
    //         if (bitWise > 0) {
    //             bitWise += 3;//aumento di un bit
    //             var fine = (Math.pow(2, bitWise)) - arr.length;
    //             for (var j = 0; j < fine; j++) {
    //                 arr.push(0);//inserisco il numero di zeri necessari
    //             }
    //             return arr;
    //         }
    //         else {
    //             return arr;
    //         }
    //     },
    //     'kaiser': function (LE, alpha) {
    //         var filter = [];
    //         for (var t = 0; t < LE; t++)
    //             filter.push(this.kaiserP(LE, alpha, t));
    //         return filter;
    //     },
    //     'meanValSub': function (arr) {
    //         var mean = 0;
    //         var L = arr.length;
    //         for (var t = 0; t < L; t++)
    //             mean += arr[t];
    //         mean = mean / L;
    //         for (var t = 0; t < L; t++)
    //             arr[t] = arr[t] - mean;
    //         return arr;
    //     },
    //     'singleRowProduct': function (filterK, arr) {
    //         for (var j = 0; j < arr.length; j++)
    //             arr[j] = arr[j] * filterK[j];
    //         return arr;

    //     },
    //     'preFFT': function (arrPre, mean, kaiserOrder) {
    //         var prePad = arrPre;
    //         if (mean == "noMean")
    //             prePad = this.meanValSub(arrPre);
    //         var aftPadAr = this.padding(prePad);
    //         var filtroKaiser = this.kaiser(aftPadAr.length, kaiserOrder);
    //         return this.singleRowProduct(filtroKaiser, aftPadAr);
    //     },
    //     'fourierSSB': function (arr) {
    //         return this.fftUtil.fftMag(this.fft(arr));
    //     },
    //     'fVector': function (fCamp, L) {
    //         var df = fCamp / (2 * (L - 1));
    //         var vecF = [];
    //         for (var i = 0; (i * df) < fCamp; i++)
    //             vecF[i] = i * df;
    //         return vecF;

    //     }
    // };
    // module.exports = preSignals;
}