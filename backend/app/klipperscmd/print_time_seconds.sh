#!/bin/bash

# print_time_seconds.sh - Print current time in seconds with various options

# Default values
FORMAT="epoch"
SHOW_HELP=false

# Function to display help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Print current time in seconds with various formats"
    echo ""
    echo "OPTIONS:"
    echo "  -f, --format FORMAT    Time format:"
    echo "                           epoch (default) - seconds since Unix epoch"
    echo "                           nano - nanoseconds since Unix epoch"
    echo "                           readable - human readable with seconds"
    echo "                           iso - ISO 8601 format with seconds"
    echo "                           elapsed - seconds since midnight today"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                     # Print seconds since Unix epoch"
    echo "  $0 -f nano             # Print nanoseconds since Unix epoch"
    echo "  $0 -f readable         # Print human readable time with seconds"
    echo "  $0 -f iso              # Print ISO 8601 format"
    echo "  $0 -f elapsed          # Print seconds since midnight today"
}

# Function to print time in various formats
print_time() {
    local format=$1
    
    case $format in
        "epoch")
            date +%s
            ;;
        "nano")
            date +%s%N
            ;;
        "readable")
            date '+%Y-%m-%d %H:%M:%S'
            ;;
        "iso")
            date --iso-8601=seconds
            ;;
        "elapsed")
            # Calculate seconds since midnight today
            current_epoch=$(date +%s)
            midnight_epoch=$(date -d "today 00:00:00" +%s)
            elapsed=$((current_epoch - midnight_epoch))
            echo "$elapsed"
            ;;
        *)
            echo "Error: Invalid format '$format'"
            exit 1
            ;;
    esac
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -h|--help)
            SHOW_HELP=true
            shift
            ;;
        *)
            echo "Error: Unknown option '$1'"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Show help if requested
if $SHOW_HELP; then
    show_help
    exit 0
fi

# Print the time
print_time "$FORMAT" 