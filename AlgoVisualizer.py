import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import random
class AlgorithmVisualizer(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Algorithm Visualizer")
        self.geometry("800x600")

        self.array = []
        self.create_widgets()

    def create_widgets(self):
        frame = ttk.Frame(self)
        frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

        self.canvas = tk.Canvas(frame, width=800, height=400, bg='white')
        self.canvas.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

        control_frame = ttk.Frame(self)
        control_frame.pack(side=tk.BOTTOM, fill=tk.X)

        ttk.Button(control_frame, text="Generate Array", command=self.generate_array).pack(side=tk.LEFT)
        ttk.Button(control_frame, text="Bubble Sort", command=self.bubble_sort).pack(side=tk.LEFT)
        ttk.Button(control_frame, text="Quick Sort", command=self.quick_sort).pack(side=tk.LEFT)

    def generate_array(self):
        self.array = [random.randint(1, 100) for _ in range(50)]
        self.draw_array()

    def draw_array(self):
        self.canvas.delete("all")
        canvas_width = 800
        canvas_height = 400
        bar_width = canvas_width / len(self.array)
        for i, val in enumerate(self.array):
            x0 = i * bar_width
            y0 = canvas_height - (val * canvas_height / 100)
            x1 = (i + 1) * bar_width
            y1 = canvas_height
            self.canvas.create_rectangle(x0, y0, x1, y1, fill="blue")

    def bubble_sort(self):
        for i in range(len(self.array)):
            for j in range(0, len(self.array) - i - 1):
                if self.array[j] > self.array[j + 1]:
                    self.array[j], self.array[j + 1] = self.array[j + 1], self.array[j]
                    self.draw_array()
                    self.update_idletasks()

    def quick_sort(self):
        self._quick_sort(0, len(self.array) - 1)
        self.draw_array()

    def _quick_sort(self, low, high):
        if low < high:
            pi = self.partition(low, high)
            self._quick_sort(low, pi - 1)
            self._quick_sort(pi + 1, high)
            self.draw_array()
            self.update_idletasks()

    def partition(self, low, high):
        pivot = self.array[high]
        i = low - 1
        for j in range(low, high):
            if self.array[j] < pivot:
                i += 1
                self.array[i], self.array[j] = self.array[j], self.array[i]
                self.draw_array()
                self.update_idletasks()
        self.array[i + 1], self.array[high] = self.array[high], self.array[i + 1]
        return i + 1

if __name__ == "__main__":
    app = AlgorithmVisualizer()
    app.mainloop()
