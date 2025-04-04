interface ProcessOptions {
    delay?: number;
    onProgress?: (progress: number) => void;
}

class ProcessingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProcessingError';
    }
}

async function processWithDelay(numbers: number[], options: ProcessOptions = {}) {
    if (!Array.isArray(numbers)) {
        throw new ProcessingError('Input phải là một mảng');
    }
    if (numbers.length === 0) {
        return {
            cancel: () => { }
        };
    }
    const delay = options.delay || 1000;
    const onProgress = options.onProgress || (() => { });
    const controller = new AbortController();
    const signal = controller.signal;
    for (let i = 0; i < numbers.length; i++) {
        if (typeof numbers[i] !== 'number') {
            throw new ProcessingError(`Phần tử tại vị trí ${i} không phải là số`);
        }
        if (signal.aborted) {
            throw new ProcessingError('Tiến trình đã bị hủy');
        }
        console.log(numbers[i]);
        const progress = ((i + 1) / numbers.length) * 100;
        onProgress(progress);
        if (i < numbers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return {
        cancel: () => controller.abort()
    };
}

async function demo() {
    const process = await processWithDelay([1, 2, 3, 4, 5], {
        delay: 1000,
        onProgress: (progress) => {
            console.log(`Process is: ${progress}%`);
        }
    });
}

demo();