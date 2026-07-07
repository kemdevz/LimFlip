import cv2
from ultralytics import YOLO

# Initialize webcam
cap = cv2.VideoCapture(0)

# Check if webcam is opened correctly
if not cap.isOpened():
    print("Error: Could not open webcam")
    exit()

print("Hand detection started. Press 'q' to quit.")
print("Loading YOLO model (this may take a moment)...")

# Load YOLO model for hand detection
model = YOLO('yolov8n.pt')  # This will auto-download the model

while True:
    # Read frame from webcam
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame")
        break
    
    # Run detection
    results = model(frame, verbose=False)
    
    # Draw results
    for result in results:
        boxes = result.boxes
        for box in boxes:
            # Get coordinates
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            
            # Get confidence and class
            conf = box.conf[0]
            cls = int(box.cls[0])
            
            # Only draw if it's a person (class 0 in COCO) or hand-like
            if cls == 0 and conf > 0.5:  # Person detection
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f'Person {conf:.2f}', (x1, y1 - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    # Display the frame
    cv2.imshow('Hand Detection', frame)
    
    # Exit on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
print("Hand detection stopped.")
